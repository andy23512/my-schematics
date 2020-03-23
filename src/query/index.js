"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const find_module_1 = require("@schematics/angular/utility/find-module");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const tsquery_1 = require("@phenomnomnominal/tsquery");
function upperCaseUnderscore(value) {
    return core_1.strings.underscore(value).toUpperCase();
}
function readIntoSourceFile(host, modulePath) {
    const text = host.read(modulePath);
    if (text === null) {
        throw new schematics_1.SchematicsException(`File ${modulePath} does not exist.`);
    }
    const sourceText = text.toString('utf-8');
    return tsquery_1.tsquery.ast(sourceText);
}
function addProvidersAndExportStatementToNgModule(_options) {
    return (_tree, _context) => {
        console.log('nanoha');
        const modulePath = find_module_1.findModule(_tree, _options.path);
        let source = readIntoSourceFile(_tree, modulePath);
        const servicePath = `/${_options.path}/${core_1.strings.dasherize(_options.name)}-query.service`;
        const relativePath = find_module_1.buildRelativePath(modulePath, servicePath);
        const classifiedName = core_1.strings.classify(_options.name) + 'QueryService';
        console.log('fate');
        console.log('hayate');
        const importRecorder = _tree.beginUpdate(modulePath);
        const importServiceChange = ast_utils_1.insertImport(source, modulePath, classifiedName, relativePath);
        console.log('hayate');
        console.log(importServiceChange);
        importRecorder.insertLeft(importServiceChange.pos, importServiceChange.toAdd);
        console.log('hayate');
        _tree.commitUpdate(importRecorder);
        console.log('hayate');
        console.log(source);
        source = readIntoSourceFile(_tree, modulePath);
        const addProviderRecorder = _tree.beginUpdate(modulePath);
        console.log(source);
        const providersArray = tsquery_1.tsquery(source, 'Identifier[name=providers] ~ ArrayLiteralExpression', { visitAllChildren: true });
        console.log(providersArray);
        addProviderRecorder.insertLeft(providersArray[0].end - 1, `\n         ${classifiedName},\n`);
        addProviderRecorder.insertLeft(importServiceChange.pos, importServiceChange.toAdd);
        _tree.commitUpdate(addProviderRecorder);
        source = readIntoSourceFile(_tree, modulePath);
        const exportRecorder = _tree.beginUpdate(modulePath);
        exportRecorder.insertLeft(source.end, `\nexport { ${classifiedName} } from '${relativePath}'`);
        _tree.commitUpdate(exportRecorder);
        return _tree;
    };
}
exports.addProvidersAndExportStatementToNgModule = addProvidersAndExportStatementToNgModule;
function genQuery(_options) {
    return (_, _context) => {
        const sourceTemplates = schematics_1.url('./files'); // 使用範本
        const sourceParametrizedTemplates = schematics_1.apply(sourceTemplates, [
            schematics_1.template(Object.assign(Object.assign(Object.assign({}, _options), core_1.strings), { upperCaseUnderscore })),
            schematics_1.move(_options.path)
        ]);
        return schematics_1.chain([
            addProvidersAndExportStatementToNgModule(_options),
            schematics_1.mergeWith(sourceParametrizedTemplates)
        ]);
    };
}
exports.genQuery = genQuery;
//# sourceMappingURL=index.js.map