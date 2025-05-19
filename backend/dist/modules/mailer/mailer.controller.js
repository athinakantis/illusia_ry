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
exports.MailerController = void 0;
const common_1 = require("@nestjs/common");
const mailer_service_1 = require("./mailer.service");
let MailerController = class MailerController {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    getStatus() {
        return { status: 'Mailer service is running' };
    }
    async sendEmail(email, subject, message) {
        try {
            const result = await this.mailerService.sendEmail(email, subject, message);
            return { message: 'Email sent successfully!', result };
        }
        catch (error) {
            console.error('Error sending email:', error);
            return { message: 'Failed to send email.', error };
        }
    }
    async signupEmailTest(to, displayName) {
        try {
            const result = await this.mailerService.sendSignupEmail(to, displayName);
            return { message: 'Signup email sent successfully!', result };
        }
        catch (error) {
            console.error('Error sending signup email:', error);
            return { message: 'Failed to send signup email.', error };
        }
    }
    async bookingApprovedTest(to, bookingId, status, startDate, endDate) {
        try {
            const result = await this.mailerService.sendBookingStatusUpdateEmail(to, bookingId, status, startDate, endDate);
            return { message: 'Booking approval email sent successfully!', result };
        }
        catch (error) {
            console.error('Error sending booking approval email:', error);
            return { message: 'Failed to send booking approval email.', error };
        }
    }
};
exports.MailerController = MailerController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], MailerController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('subject')),
    __param(2, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MailerController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)('to')),
    __param(1, (0, common_1.Body)('displayName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MailerController.prototype, "signupEmailTest", null);
__decorate([
    (0, common_1.Post)('booking-approved'),
    __param(0, (0, common_1.Body)('to')),
    __param(1, (0, common_1.Body)('bookingId')),
    __param(2, (0, common_1.Body)('status')),
    __param(3, (0, common_1.Body)('startDate')),
    __param(4, (0, common_1.Body)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MailerController.prototype, "bookingApprovedTest", null);
exports.MailerController = MailerController = __decorate([
    (0, common_1.Controller)('mailer'),
    __metadata("design:paramtypes", [mailer_service_1.MailerService])
], MailerController);
//# sourceMappingURL=mailer.controller.js.map