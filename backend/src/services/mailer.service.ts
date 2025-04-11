import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter;

    constructor() {
        // Set up the transporter (configure email service and credentials)
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // Send email method
    async sendEmail(to: string, subject: string, text: string): Promise<any> {
        const mailOptions = {
            from: process.env.EMAIL, // Sender address
            to, // Receiver address
            subject, // Subject line
            text, // Message body
        };

        // Send the email
        return this.transporter.sendMail(mailOptions);
    }
}