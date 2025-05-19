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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const bookings_service_1 = require("./bookings.service");
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    async getAllBookings(req) {
        return this.bookingService.getBookings(req);
    }
    async getBookingById(req, id) {
        return this.bookingService.getBookingById(req, id);
    }
    async getBookingsByUserId(req, user_id) {
        if (!user_id) {
            return {
                message: 'User ID is required',
                error: 'User ID is required',
            };
        }
        if (user_id.length !== 36) {
            return {
                message: 'Invalid User ID',
                error: 'Invalid User ID',
            };
        }
        return this.bookingService.getUserBookings(req, user_id);
    }
    async createBooking(req, payload) {
        return this.bookingService.createBooking(req, payload);
    }
    async createViaRpc(req, dto) {
        return this.bookingService.createBookingWithItemsViaRpc(req, dto);
    }
    async createEmptyBooking(req) {
        return this.bookingService.createEmptyBooking(req);
    }
    async reviewBooking(req, bookingId) {
        return this.bookingService.reviewBookingAvailability(req, bookingId);
    }
    async updateBookingStatus(req, bookingId, payload) {
        return this.bookingService.updateBookingStatus(req, bookingId, payload.status);
    }
    async deleteBooking(req, id) {
        return this.bookingService.deleteBooking(req, id);
    }
    async getUpcomingBookings(req, amount) {
        return this.bookingService.getUpcomingBookings(req, amount);
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getAllBookings", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookingById", null);
__decorate([
    (0, common_1.Get)('user/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookingsByUserId", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Post)('rpc'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createViaRpc", null);
__decorate([
    (0, common_1.Post)('empty'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createEmptyBooking", null);
__decorate([
    (0, common_1.Post)(':id/review'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "reviewBooking", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "updateBookingStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "deleteBooking", null);
__decorate([
    (0, common_1.Get)(`upcoming/:amount`),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getUpcomingBookings", null);
exports.BookingController = BookingController = __decorate([
    (0, common_1.Controller)('bookings'),
    __metadata("design:paramtypes", [bookings_service_1.BookingService])
], BookingController);
//# sourceMappingURL=bookings.controller.js.map