import {
  Rule,
  SchematicContext,
  Tree,
  url,
  apply,
  mergeWith,
  template,
  move,
  chain,
  SchematicsException
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { Schema } from './schema';
import {
  findModule,
  buildRelativePath
} from '@schematics/angular/utility/find-module';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';
import { InsertChange } from '@schematics/angular/utility/change';
import { tsquery } from '@phenomnomnominal/tsquery';

function upperCaseUnderscore(value: string) {
  return strings.underscore(value).toUpperCase();
}

function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString('utf-8');
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
    const classifiedName = strings.classify(_options.name) + 'MutationService';

    const importRecorder = _tree.beginUpdate(modulePath);
    const importServiceChange = insertImport(
      source,
      modulePath,
      classifiedName,
      relativePath
    ) as InsertChange;
    importRecorder.insertLeft(
      importServiceChange.pos,
      importServiceChange.toAdd
    );
    _tree.commitUpdate(importRecorder);

    source = readIntoSourceFile(_tree, modulePath);
    const addProviderRecorder = _tree.beginUpdate(modulePath);
    const providersArray = tsquery(
      source,
      'Identifier[name=providers] ~ ArrayLiteralExpression',
      { visitAllChildren: true }
    );
    addProviderRecorder.insertLeft(
      providersArray[0].end - 1,
      `        ${classifiedName},\n`
    );
    addProviderRecorder.insertLeft(
      importServiceChange.pos,
      importServiceChange.toAdd
    );
    _tree.commitUpdate(addProviderRecorder);

    source = readIntoSourceFile(_tree, modulePath);
    const exportRecorder = _tree.beginUpdate(modulePath);
    exportRecorder.insertLeft(
      source.end,
      `\nexport { ${classifiedName} } from '${relativePath}'`
    );
    _tree.commitUpdate(exportRecorder);

    return _tree;
  };
}

export function genMutation(_options: Schema): Rule {
  return (_: Tree, _context: SchematicContext) => {
    const sourceTemplates = url('./files'); // 使用範本

    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ..._options, // 使用者所輸入的參數
        ...strings,
        upperCaseUnderscore
      }),
      move(_options.path)
    ]);

    return chain([
      addProvidersAndExportStatementToNgModule(_options),
      mergeWith(sourceParametrizedTemplates)
    ]);
  };
}
