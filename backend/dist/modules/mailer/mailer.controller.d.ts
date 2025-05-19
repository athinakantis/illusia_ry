import { MailerService } from './mailer.service';
import { SentMessageInfo } from 'nodemailer';
export declare class MailerController {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    getStatus(): {
        status: string;
    };
    sendEmail(email: string, subject: string, message: string): Promise<{
        message: string;
        result?: SentMessageInfo;
        error?: undefined;
    }>;
    signupEmailTest(to: string, displayName: string): Promise<{
        message: string;
        result?: SentMessageInfo;
        error?: undefined;
    }>;
    bookingApprovedTest(to: string, bookingId: string, status: 'approved' | 'rejected', startDate?: string, endDate?: string): Promise<{
        message: string;
        result?: SentMessageInfo;
        error?: undefined;
    }>;
}
