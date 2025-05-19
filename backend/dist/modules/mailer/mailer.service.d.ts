import { ConfigService } from '@nestjs/config';
import { SentMessageInfo } from 'nodemailer';
export declare class MailerService {
    private config;
    private transporter;
    constructor(config: ConfigService);
    renderHtml(page: string): Promise<string>;
    sendEmail(to: string, subject: string, text: string, html?: string, attachments?: {
        fileName: string;
        cid: string;
        path: string;
    }[]): Promise<SentMessageInfo>;
    sendSignupEmail(to: string, displayName: string): Promise<any>;
    sendBookingStatusUpdateEmail(to: string, bookingId: string, status: 'approved' | 'rejected', startDate?: string, endDate?: string): Promise<any>;
    sendAccountDeactivatedEmail(to: string): Promise<any>;
    newUserEmail(to: string, displayName: string): Promise<any>;
    approveAccountEmail(to: string, displayName: string): Promise<any>;
}
