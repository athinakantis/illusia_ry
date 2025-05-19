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
exports.ItemReservationsController = void 0;
const common_1 = require("@nestjs/common");
const updateReservations_dto_1 = require("./dto/updateReservations.dto");
const reservations_service_1 = require("./reservations.service");
let ItemReservationsController = class ItemReservationsController {
    constructor(itemReservationService) {
        this.itemReservationService = itemReservationService;
    }
    async getAllReservations(req) {
        return this.itemReservationService.getAllReservations(req);
    }
    async getByItem(req, itemId) {
        return this.itemReservationService.getReservationsForItem(req, itemId);
    }
    async getByBooking(req, bookingId) {
        return this.itemReservationService.getReservationsByBooking(req, bookingId);
    }
    async getByDateRange(req, from, to) {
        return this.itemReservationService.getReservationsInDateRange(req, from, to);
    }
    async getByItemAndDateRange(req, itemId, from, to) {
        return this.itemReservationService.getReservationsForItemInDateRange(req, itemId, from, to);
    }
    async getByStartDate(req, startDate) {
        return this.itemReservationService.getReservationsByStartDate(req, startDate);
    }
    async getByEndDate(req, endDate) {
        return this.itemReservationService.getReservationsByEndDate(req, endDate);
    }
    async createReservation(req, dto) {
        return this.itemReservationService.createReservation(req, dto);
    }
    async deleteReservations(req, bookingId, reservationIds) {
        return this.itemReservationService.deleteReservations(req, bookingId, reservationIds);
    }
    async updateReservation(req, bookingId, reservationId, dto) {
        return this.itemReservationService.updateReservation(req, bookingId, reservationId, dto);
    }
};
exports.ItemReservationsController = ItemReservationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ItemReservationsController.prototype, "getAllReservations", null);
__decorate([
    (0, common_1.Get)('item/:itemId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ItemReservationsController.prototype, "getByItem", null);
__decorate([
    (0, common_1.Get)('booking/:bookingId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ItemReservationsController.prototype, "getByBooking", null);
__decorate([
    (0, common_1.Get)('date-range'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ItemReservationsController.prototype, "getByDateRange", null);
__decorate([
    (0, common_1.Get)('item/:itemId/date-range'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ItemReservationsController.prototype, "getByItemAndDateRange", null);
__decorate([
    (0, common_1.Get)('start-date/:startDate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('startDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ItemReservationsController.prototype, "getByStartDate", null);
__decorate([
    (0, common_1.Get)('end-date/:endDate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ItemReservationsController.prototype, "getByEndDate", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ItemReservationsController.prototype, "createReservation", null);
__decorate([
    (0, common_1.Delete)('booking/:bookingId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('bookingId')),
    __param(2, (0, common_1.Body)('reservationIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], ItemReservationsController.prototype, "deleteReservations", null);
__decorate([
    (0, common_1.Patch)('booking/:bookingId/:reservationId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('bookingId')),
    __param(2, (0, common_1.Param)('reservationId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, updateReservations_dto_1.UpdateReservationDto]),
    __metadata("design:returntype", Promise)
], ItemReservationsController.prototype, "updateReservation", null);
exports.ItemReservationsController = ItemReservationsController = __decorate([
    (0, common_1.Controller)('reservations'),
    __metadata("design:paramtypes", [reservations_service_1.ItemReservationService])
], ItemReservationsController);
//# sourceMappingURL=reservations.controller.js.map