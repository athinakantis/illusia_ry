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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    constructor(AdminsService) {
        this.AdminsService = AdminsService;
    }
    async getAllUsers(req) {
        return this.AdminsService.getAllUsers(req);
    }
    async getUsersWithRoles(req) {
        return this.AdminsService.getUsersWithRole(req);
    }
    async getUserById(req, userId) {
        return this.AdminsService.getUserById(req, userId);
    }
    async getUserRole(req, userId) {
        return this.AdminsService.getUserRoleById(req, userId);
    }
    async updateUserStatus(req, body) {
        if (!body.userId || typeof body.userId !== 'string') {
            throw new common_1.BadRequestException('Body must contain a "userId" string property');
        }
        if (!body.status || typeof body.status !== 'string') {
            throw new common_1.BadRequestException('Body must contain a "status" string property');
        }
        return this.AdminsService.updateUserStatus(req, body.userId, body.status);
    }
    async updateAnyRole(req, body) {
        if (!body.userId || typeof body.userId !== 'string') {
            throw new common_1.BadRequestException('Body must contain a "userId" string property');
        }
        if (!body.role || typeof body.role !== 'string') {
            throw new common_1.BadRequestException('Body must contain a "role" string property');
        }
        return this.AdminsService.updateUserRole(req, body.userId, body.role);
    }
    async promoteUserToAdmin(req, userId) {
        return this.AdminsService.promoteUserToAdmin(req, userId);
    }
    async approveUserToUser(req, userId) {
        return this.AdminsService.approveUserToUser(req, userId);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('users/role'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsersWithRoles", null);
__decorate([
    (0, common_1.Get)('user/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Get)('user/:id/role'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserRole", null);
__decorate([
    (0, common_1.Patch)('users/status'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Patch)('users/role'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAnyRole", null);
__decorate([
    (0, common_1.Patch)('users/:id/promote-to-admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "promoteUserToAdmin", null);
__decorate([
    (0, common_1.Patch)('users/:id/approve'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveUserToUser", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map