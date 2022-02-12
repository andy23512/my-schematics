import { strings } from "@angular-devkit/core";
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from "@angular-devkit/schematics";
import { Schema } from "./schema";

export function genComponentStore(_options: Schema): Rule {
  return (_: Tree, _context: SchematicContext) => {
    const sourceTemplates = url("./files"); // 使用範本

    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ..._options, // 使用者所輸入的參數
        ...strings,
      }),
      move(_options.path),
    ]);

    return chain([mergeWith(sourceParametrizedTemplates)]);
  };
}
