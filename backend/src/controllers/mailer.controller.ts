import { Controller, Post, Body, Get } from '@nestjs/common';
import { MailerService } from '../services/mailer.service';
import { SentMessageInfo } from 'nodemailer';

@Controller('mailer')
export class MailerController {
    constructor(private readonly mailerService: MailerService) { }

    @Get()
    getHello() {
        console.log("mailer is here")
    }

    @Post('send')
    async sendEmail(
        @Body('email') email: string,
        @Body('subject') subject: string,
        @Body('message') message: string,
    ): Promise<{ message: string; result: SentMessageInfo } | { message: string; error: any }> {
        try {
            const result = await this.mailerService.sendEmail(email, subject, message);
            return { message: 'Email sent successfully!', result };
        } catch (error) {
            console.error('Error sending email:', error);
            return { message: 'Failed to send email.', error };
        }
    }
}
