import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { createTransport, SentMessageInfo } from 'nodemailer';
// import hbs from 'nodemailer-express-handlebars';
import { promises as fs } from 'fs';
import * as path from 'path';



@Injectable()
export class MailerService {
  private transporter;

  constructor(private config: ConfigService) {
    const clientId = this.config.get<string>('GOOGLE_WEB_CLIENT_ID'); // Client ID from Google Cloud Console
    const clientSecret = this.config.get<string>('GOOGLE_WEB_SECRET'); // Client Secret from Google Cloud Console
    const refreshToken = this.config.get<string>('GOOGLE_WEB_REFRESH_TOKEN'); // Refresh Token from Google OAuth2 Playground
    const userEmail = this.config.get<string>('EMAIL'); // User email that will send the email

    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground',
    );
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: userEmail,
        clientId,
        clientSecret,
        refreshToken,
      },
    });

    // patch to auto-refresh the access token
    const orig = this.transporter.sendMail.bind(this.transporter);

    this.transporter.sendMail = async (options) => {
      const { token } = await oAuth2Client.getAccessToken();
      // @ts-expect-error it things the property doesn't exist
      this.transporter.options.auth.accessToken = token;
      return orig(options);
    };
  }

  
  /**
   * Render HTML function that returns the page
   * to be rendered in an email
   */
  async renderHtml(page: string) {
    const htmlPath = path.join(__dirname, '..', 'email_content', `${page}.html`)
    const htmlFromPage = await fs.readFile(htmlPath, 'utf-8');
    return htmlFromPage
  }

  /**
   * Low‐level send helper
   */
  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
    attachments?: {
      fileName: string,
      cid: string,
      path: string
    }[]
  ): Promise<SentMessageInfo> {
    return this.transporter.sendMail({
      from: this.config.get<string>('EMAIL'),
      to,
      subject,
      text,
      html,
      attachments
    });
  }

  /**
   * Send a welcome email when a user signs up.
   * @param to           The user’s email address.
   * @param displayName  The user’s display name.
   */
  async sendSignupEmail(to: string, displayName: string) {
    const subject = 'Welcome to Illusia!';
    const text = `Hi ${displayName},

    Thank you for signing up for Illusia. We're excited to have you onboard!

    Best regards,
    The Illusia Team`;

    const PAGE = 'signup'
    const html = await this.renderHtml(PAGE) 

    const attachments = [{
      fileName: "welcome.jpg",
      path: "https://crralkzqnflfzntlhccj.supabase.co/storage/v1/object/public/email-images//41103945280_6ba926b4bc_k_resized.jpg",
      cid: "illusia_ry_signup_notification"
    }]
    return this.sendEmail(to, subject, text, html, attachments);
  }

  /**
   * Notify the user when their booking is approved.
   * @param to           The user’s email address.
   * @param bookingId    The booking identifier.
   * @param startDate?   (Optional) Booking start date (YYYY-MM-DD).
   * @param endDate?     (Optional) Booking end date (YYYY-MM-DD).
   */
  async sendBookingApprovedEmail(
    to: string,
    bookingId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const subject = 'Your booking has been approved';
    let text = `Hello,

Your booking with ID ${bookingId} has been approved.`;
    if (startDate && endDate) {
      text += `

Booking dates: ${startDate} - ${endDate}`;
    }
    text += `

You can view more details in your dashboard.

Thanks,
The Illusia Team`;
    const html = `
`;
    return this.sendEmail(to, subject, text, html);
  }
}
