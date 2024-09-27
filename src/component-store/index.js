"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genComponentStore = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
function genComponentStore(_options) {
    return (_, _context) => {
        const sourceTemplates = (0, schematics_1.url)("./files"); // 使用範本
        const sourceParametrizedTemplates = (0, schematics_1.apply)(sourceTemplates, [
            (0, schematics_1.template)(Object.assign(Object.assign({}, _options), core_1.strings)),
            (0, schematics_1.move)(_options.path),
        ]);
        return (0, schematics_1.chain)([(0, schematics_1.mergeWith)(sourceParametrizedTemplates)]);
    };
}
exports.genComponentStore = genComponentStore;
//# sourceMappingURL=index.js.map