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
import * as ts from "typescript";
import { Schema } from "./schema";

function upperCaseUnderscore(value: string) {
  return strings.underscore(value).toUpperCase();
}

function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString("utf-8");
  return tsquery.ast(sourceText);
}

export function addProvidersAndExportStatementToNgModule(
  _options: Schema
): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const modulePath = findModule(_tree, _options.path);
    let source = readIntoSourceFile(_tree, modulePath);
    const servicePath = `/${_options.path}/${strings.dasherize(
      _options.name
    )}-mutation.service`;
    const relativePath = buildRelativePath(modulePath, servicePath);
    const classifiedName = strings.classify(_options.name) + "MutationService";

    const exportRecorder = _tree.beginUpdate(modulePath);
    exportRecorder.insertLeft(
      source.end,
      `export { ${classifiedName} } from '${relativePath}';\n`
    );
    _tree.commitUpdate(exportRecorder);

    return _tree;
  };
}

export function genMutation(_options: Schema): Rule {
  return (_: Tree, _context: SchematicContext) => {
    const sourceTemplates = url("./files"); // 使用範本

    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ..._options, // 使用者所輸入的參數
        ...strings,
        upperCaseUnderscore,
      }),
      move(_options.path),
    ]);

    return chain([
      addProvidersAndExportStatementToNgModule(_options),
      mergeWith(sourceParametrizedTemplates),
    ]);
  };
}
