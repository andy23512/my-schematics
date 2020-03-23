import {
  Rule,
  SchematicContext,
  Tree,
  url,
  apply,
  mergeWith,
  template
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { Schema } from './schema';

function upperCaseUnderscore(value: string) {
  return strings.underscore(value).toUpperCase();
}

export function genQuery(_options: Schema): Rule {
  return (_: Tree, _context: SchematicContext) => {
    const sourceTemplates = url('./files'); // 使用範本

    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ..._options, // 使用者所輸入的參數
        ...strings,
        upperCaseUnderscore
      })
    ]);

    return mergeWith(sourceParametrizedTemplates);
  };
}
