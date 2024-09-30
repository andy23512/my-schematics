"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genDirective = exports.addImportAndDeclarationToModule = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const tsquery_1 = require("@phenomnomnominal/tsquery");
const find_module_1 = require("@schematics/angular/utility/find-module");
const path_1 = require("path");
const ts = require("typescript");
function readIntoSourceFile(host, modulePath) {
    const text = host.read(modulePath);
    if (text === null) {
        throw new schematics_1.SchematicsException(`File ${modulePath} does not exist.`);
    }
    const sourceText = text.toString("utf-8");
    return tsquery_1.tsquery.ast(sourceText);
}
function addImportAndDeclarationToModule(_options) {
    return (_tree, _context) => {
        const modulePath = (0, find_module_1.findModule)(_tree, _options.path);
        let source = readIntoSourceFile(_tree, modulePath);
        const directivePath = `/${_options.path}/${core_1.strings.dasherize(_options.name)}.directive`;
        const relativePath = (0, find_module_1.buildRelativePath)(modulePath, directivePath);
        const classifiedName = core_1.strings.classify(_options.name) + "Directive";
        const classDeclaration = source.statements.find(node => ts.isClassDeclaration(node));
        const decorator = ts.getDecorators(classDeclaration)[0];
        const callExpression = decorator.expression;
        const objectLiteralExpression = callExpression.arguments[0];
        const propertyAssignment = objectLiteralExpression.properties.find((property) => {
            return property.name.text === 'declarations';
        });
        const arrayLiteralExpression = propertyAssignment.initializer;
        const identifier = arrayLiteralExpression.elements[arrayLiteralExpression.elements.length - 1];
        const updateRecorder = _tree.beginUpdate(modulePath);
        const changeText = identifier.getFullText(source);
        let toInsert = '';
        if (changeText.match(/^\r?\r?\n/)) {
            toInsert = `,${changeText.match(/^\r?\n\s*/)[0]}${classifiedName}`;
        }
        else {
            toInsert = `, ${classifiedName}`;
        }
        updateRecorder.insertLeft(identifier.end, toInsert);
        const allImports = source.statements.filter(node => ts.isImportDeclaration(node));
        let lastImport;
        for (const importNode of allImports) {
            if (!lastImport || importNode.getStart() > lastImport.getStart()) {
                lastImport = importNode;
            }
        }
        const importStr = `\nimport { ${classifiedName} } from '${relativePath}';`;
        updateRecorder.insertLeft(lastImport.end, importStr);
        _tree.commitUpdate(updateRecorder);
        return _tree;
    };
}
exports.addImportAndDeclarationToModule = addImportAndDeclarationToModule;
function genDirective(_options) {
    return (_, _context) => {
        _options.name = (0, path_1.basename)(_options.name);
        _options.path = (0, path_1.normalize)(_options.path + '/' + _options.name);
        const sourceTemplates = (0, schematics_1.url)("./files"); // 使用範本
        const sourceParametrizedTemplates = (0, schematics_1.apply)(sourceTemplates, [
            (0, schematics_1.template)(Object.assign(Object.assign({}, _options), core_1.strings)),
            (0, schematics_1.move)(_options.path),
        ]);
        return (0, schematics_1.chain)([
            addImportAndDeclarationToModule(_options),
            (0, schematics_1.mergeWith)(sourceParametrizedTemplates)
        ]);
    };
}
exports.genDirective = genDirective;
//# sourceMappingURL=index.js.map