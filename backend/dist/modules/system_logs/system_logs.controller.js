"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemLogsController = void 0;
const common_1 = require("@nestjs/common");
const system_logs_service_1 = require("./system_logs.service");
const role_guard_1 = require("../../guards/role.guard");
let SystemLogsController = class SystemLogsController {
    constructor(logsService) {
        this.logsService = logsService;
        this.allowedTableNames = [
            'users',
            "roles",
            "user_roles",
            "tags",
            "item_tags",
            "categories",
            'items',
            'bookings',
            'item_reservations',
            'system_logs',
        ];
    }
    async getLogs(limit, page, actionType, tableName, userId, search, from, to) {
        if (tableName && !this.allowedTableNames.includes(tableName)) {
            return {
                message: 'Invalid table name',
                error: 'Invalid table name',
                data: [],
            };
        }
        ;
        return this.logsService.findAll({
            limit: limit ? Number(limit) : undefined,
            page: page ? Number(page) : undefined,
            actionType,
            tableName,
            userId,
            search,
            from,
            to,
        });
    }
};
exports.SystemLogsController = SystemLogsController;
__decorate([
    (0, common_1.UseGuards)((0, role_guard_1.AuthGuard)('Admin', 'Head Admin')),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('action_type')),
    __param(3, (0, common_1.Query)('table_name')),
    __param(4, (0, common_1.Query)('user_id')),
    __param(5, (0, common_1.Query)('search')),
    __param(6, (0, common_1.Query)('from')),
    __param(7, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SystemLogsController.prototype, "getLogs", null);
exports.SystemLogsController = SystemLogsController = __decorate([
    (0, common_1.Controller)('system-logs'),
    __metadata("design:paramtypes", [system_logs_service_1.SystemLogsService])
], SystemLogsController);
//# sourceMappingURL=system_logs.controller.js.map