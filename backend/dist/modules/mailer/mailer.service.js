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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const googleapis_1 = require("googleapis");
const nodemailer_1 = require("nodemailer");
const fs_1 = require("fs");
const path = require("path");
let MailerService = class MailerService {
    constructor(config) {
        this.config = config;
        const clientId = this.config.get('GOOGLE_WEB_CLIENT_ID');
        const clientSecret = this.config.get('GOOGLE_WEB_SECRET');
        const refreshToken = this.config.get('GOOGLE_WEB_REFRESH_TOKEN');
        const userEmail = this.config.get('EMAIL');
        const oAuth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, 'https://developers.google.com/oauthplayground');
        oAuth2Client.setCredentials({ refresh_token: refreshToken });
        this.transporter = (0, nodemailer_1.createTransport)({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: userEmail,
                clientId,
                clientSecret,
                refreshToken,
            },
        });
        const orig = this.transporter.sendMail.bind(this.transporter);
        this.transporter.sendMail = async (options) => {
            const { token } = await oAuth2Client.getAccessToken();
            this.transporter.options.auth.accessToken = token;
            return orig(options);
        };
    }
    async renderHtml(page) {
        const htmlPath = path.join(__dirname, '..', 'email_content', `${page}.html`);
        const htmlFromPage = await fs_1.promises.readFile(htmlPath, 'utf-8');
        return htmlFromPage;
    }
    async sendEmail(to, subject, text, html, attachments) {
        return this.transporter.sendMail({
            from: this.config.get('EMAIL'),
            to,
            subject,
            text,
            html,
            attachments
        });
    }
    async sendSignupEmail(to, displayName) {
        const subject = 'Welcome to Illusia!';
        const text = `Hi ${displayName},

    Thank you for signing up for Illusia. We're excited to have you onboard!

    Best regards,
    The Illusia Team`;
        const PAGE = 'signup';
        const html = await this.renderHtml(PAGE);
        const attachments = [{
                fileName: "welcome.jpg",
                path: `${process.env.SUPABASE_URL}/storage/v1/object/public/email-images//41103945280_6ba926b4bc_k_resized.jpg`,
                cid: "illusia_ry_signup_notification"
            }];
        return this.sendEmail(to, subject, text, html, attachments);
    }
    async sendBookingStatusUpdateEmail(to, bookingId, status, startDate, endDate) {
        if (!['approved', 'rejected'].includes(status)) {
            throw new Error('Invalid status. Must be "approved" or "rejected".');
        }
        const subject = `Your booking has been ${status}`;
        let text = `Hello,

Your booking with ID ${bookingId} has been ${status}.`;
        if (startDate && endDate) {
            text += `

Booking dates: ${startDate} - ${endDate}`;
        }
        text += `

You can view more details in your dashboard.

Thanks,
The Illusia Team`;
        return this.sendEmail(to, subject, text);
    }
    async sendAccountDeactivatedEmail(to) {
        const subject = 'Your Illusia Account Has Been Deactivated';
        const text = `Hello,
  
  We wanted to inform you that your Illusia account has been deactivated. 
  
  If you believe this was a mistake or would like to appeal, please contact our support team.
  
  Thank you,
  The Illusia Team`;
        return this.sendEmail(to, subject, text);
    }
    async newUserEmail(to, displayName) {
        const subject = 'New User Signup';
        const text = `A new user has signed up on Illusia:
Name: ${displayName}
Email: ${to}`;
        return this.sendEmail(to, subject, text);
    }
    async approveAccountEmail(to, displayName) {
        const subject = `Your account has been approved!`;
        const text = `Hello ${displayName},
Your account has been activated  on Illusia.
You can now log in and start using our platform.
We are thrilled to have you as part of our community and look forward to supporting you on your journey.

If you have any questions, please contact our support team.
Thank you,
The Illusia Team`;
        return this.sendEmail(to, subject, text);
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailerService);
//# sourceMappingURL=mailer.service.js.map