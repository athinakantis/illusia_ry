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
exports.GuestController = void 0;
const common_1 = require("@nestjs/common");
const guest_service_1 = require("./guest.service");
const role_guard_1 = require("../../guards/role.guard");
let GuestController = class GuestController {
    constructor(guestService) {
        this.guestService = guestService;
    }
    async getAllCategories() {
        return this.guestService.getCategories();
    }
    async getFilteredItems(categories) {
        const formattedCategories = categories.split(' ');
        formattedCategories.map(cat => cat.replace('-', ' '));
        return this.guestService.getItemsByCategories(formattedCategories);
    }
    async getItemsAdmin() {
        return this.guestService.getItemsAdmin();
    }
    async getItemById(id) {
        console.log("Fetching item with ID:", id);
        return this.guestService.getItemById(id);
    }
    async getItems() {
        return this.guestService.getPublicItems();
    }
};
exports.GuestController = GuestController;
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)(`filter`),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getFilteredItems", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)((0, role_guard_1.AuthGuard)('Admin', "Head Admin")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getItemsAdmin", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getItemById", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getItems", null);
exports.GuestController = GuestController = __decorate([
    (0, common_1.Controller)('items'),
    __metadata("design:paramtypes", [guest_service_1.GuestService])
], GuestController);
//# sourceMappingURL=guest.controller.js.map