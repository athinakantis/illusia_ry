"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemLogsModule = void 0;
const common_1 = require("@nestjs/common");
const system_logs_controller_1 = require("./system_logs.controller");
const system_logs_service_1 = require("./system_logs.service");
const supabae_module_1 = require("../supabase/supabae.module");
let SystemLogsModule = class SystemLogsModule {
};
exports.SystemLogsModule = SystemLogsModule;
exports.SystemLogsModule = SystemLogsModule = __decorate([
    (0, common_1.Module)({
        imports: [supabae_module_1.SupabaseModule],
        controllers: [system_logs_controller_1.SystemLogsController],
        providers: [system_logs_service_1.SystemLogsService],
        exports: [],
    })
], SystemLogsModule);
//# sourceMappingURL=system_logs.module.js.map