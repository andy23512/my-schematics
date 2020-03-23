import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function genMutation(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return tree;
  };
}
