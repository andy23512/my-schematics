"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
function upperCaseUnderscore(value) {
    return core_1.strings.underscore(value).toUpperCase();
}
function genQuery(_options) {
    return (_, _context) => {
        const sourceTemplates = schematics_1.url('./files'); // 使用範本
        const sourceParametrizedTemplates = schematics_1.apply(sourceTemplates, [
            schematics_1.template(Object.assign(Object.assign(Object.assign({}, _options), core_1.strings), { upperCaseUnderscore }))
        ]);
        return schematics_1.mergeWith(sourceParametrizedTemplates);
    };
}
exports.genQuery = genQuery;
//# sourceMappingURL=index.js.map