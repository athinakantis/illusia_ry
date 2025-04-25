import { Controller, Post, Body, Get } from '@nestjs/common';
import { MailerService } from '../services/mailer.service';
import { SentMessageInfo } from 'nodemailer';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Get()
  getStatus(): { status: string } {
    return { status: 'Mailer service is running' };
  }

  @Post('send')
  async sendEmail(
    @Body('email') email: string,
    @Body('subject') subject: string,
    @Body('message') message: string,
  ): Promise<{ message: string; result?: SentMessageInfo; error?: any }> {
    try {
      const result = await this.mailerService.sendEmail(email, subject, message);
      return { message: 'Email sent successfully!', result };
    } catch (error) {
      console.error('Error sending email:', error);
      return { message: 'Failed to send email.', error };
    }
  }

  @Post('signup')
  async signupEmailTest(
    @Body('to') to: string,
    @Body('displayName') displayName: string,
  ): Promise<{ message: string; result?: SentMessageInfo; error?: any }> {
    try {
      const result = await this.mailerService.sendSignupEmail(to, displayName);
      return { message: 'Signup email sent successfully!', result };
    } catch (error) {
      console.error('Error sending signup email:', error);
      return { message: 'Failed to send signup email.', error };
    }
  }

  @Post('booking-approved')
  async bookingApprovedTest(
    @Body('to') to: string,
    @Body('bookingId') bookingId: string,
    @Body('startDate') startDate?: string,
    @Body('endDate') endDate?: string,
  ): Promise<{ message: string; result?: SentMessageInfo; error?: any }> {
    try {
      const result = await this.mailerService.sendBookingApprovedEmail(
        to,
        bookingId,
        startDate,
        endDate,
      );
      return { message: 'Booking approval email sent successfully!', result };
    } catch (error) {
      console.error('Error sending booking approval email:', error);
      return { message: 'Failed to send booking approval email.', error };
    }
  }
}
