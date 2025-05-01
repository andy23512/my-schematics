import { strings } from "@angular-devkit/core";
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url,
} from "@angular-devkit/schematics";
import { tsquery } from "@phenomnomnominal/tsquery";
import {
  buildRelativePath,
  findModule,
} from "@schematics/angular/utility/find-module";
import { basename, normalize } from "path";
import { Schema } from "./schema";
import ts = require("typescript");

function readIntoSourceFile(host: Tree, modulePath: string) {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString("utf-8");
  return tsquery.ast(sourceText);
}

export function addImportAndDeclarationToModule(_options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const modulePath = findModule(_tree, _options.path);
    let source = readIntoSourceFile(_tree, modulePath);
    const directivePath = `/${_options.path}/${strings.dasherize(
      _options.name
    )}.directive`;
    const relativePath = buildRelativePath(modulePath, directivePath);
    const classifiedName = strings.classify(_options.name) + "Directive";

    const classDeclaration = source.statements.find((node) =>
      ts.isClassDeclaration(node)
    )! as ts.ClassDeclaration;
    const decorator = ts.getDecorators(classDeclaration)![0] as ts.Decorator;
    const callExpression = decorator.expression as ts.CallExpression;
    const objectLiteralExpression = callExpression
      .arguments[0] as ts.ObjectLiteralExpression;
    const propertyAssignment = objectLiteralExpression.properties.find(
      (property: ts.PropertyAssignment) => {
        return (property.name as ts.Identifier).text === "declarations";
      }
    )! as ts.PropertyAssignment;
    const arrayLiteralExpression =
      propertyAssignment.initializer as ts.ArrayLiteralExpression;
    const identifier = arrayLiteralExpression.elements[
      arrayLiteralExpression.elements.length - 1
    ] as ts.Identifier;

    const updateRecorder = _tree.beginUpdate(modulePath);
    const changeText = identifier.getFullText(source);
    let toInsert = "";
    if (changeText.match(/^\r?\r?\n/)) {
      toInsert = `,${changeText.match(/^\r?\n\s*/)![0]}${classifiedName}`;
    } else {
      toInsert = `, ${classifiedName}`;
    }
    updateRecorder.insertLeft(identifier.end, toInsert);

    const allImports = source.statements.filter((node) =>
      ts.isImportDeclaration(node)
    )! as ts.ImportDeclaration[];
    let lastImport: ts.Node | undefined;
    for (const importNode of allImports) {
      if (!lastImport || importNode.getStart() > lastImport.getStart()) {
        lastImport = importNode;
      }
    }
    const importStr = `\nimport { ${classifiedName} } from '${relativePath}';`;
    updateRecorder.insertLeft(lastImport!.end, importStr);

    _tree.commitUpdate(updateRecorder);

    return _tree;
  };
}

export function genDirective(_options: Schema): Rule {
  return (_: Tree, _context: SchematicContext) => {
    _options.name = basename(_options.name);
    _options.path = normalize(_options.path + "/" + _options.name);
    const sourceTemplates = url("./files"); // 使用範本

    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ..._options, // 使用者所輸入的參數
        ...strings,
      }),
      move(_options.path),
    ]);

    return chain([
      ...(_options.standalone
        ? []
        : [addImportAndDeclarationToModule(_options)]),
      mergeWith(sourceParametrizedTemplates),
    ]);
  };
}
