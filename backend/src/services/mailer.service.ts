import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { google } from 'googleapis';

import path from 'path';
import  { createTransport, SentMessageInfo } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';


@Injectable()
export class MailerService {
  private transporter

  constructor(private config: ConfigService) {
    const clientId     = this.config.get<string>('GOOGLE_WEB_CLIENT_ID'); // Client ID from Google Cloud Console
    const clientSecret = this.config.get<string>('GOOGLE_WEB_SECRET'); // Client Secret from Google Cloud Console
    const refreshToken = this.config.get<string>('GOOGLE_WEB_REFRESH_TOKEN'); // Refresh Token from Google OAuth2 Playground
    const userEmail    = this.config.get<string>('EMAIL'); // User email that will send the email

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

    // attach Handlebars plugin for HTML templates
    this.transporter.use(
      'compile', hbs({
        viewEngine: {
          extname: '.hbs',
          partialsDir: path.resolve(__dirname, '../../templates/partials'),
          layoutsDir: path.resolve(__dirname, '../../templates/layouts'),
          defaultLayout: 'main',
        },
        viewPath: path.resolve(__dirname, '../../templates'),
        extName: '.hbs',
      })
    );
  }
  
  


  /**
   * Low‐level send helper
   */
  async sendEmail(
    to: string,
    subject: string,
    text: string
  ): Promise<SentMessageInfo> {
    return this.transporter.sendMail({
      from: this.config.get<string>('EMAIL'),
      to,
      subject,
      text,
    });
  }

  /**
   * Send a welcome email when a user signs up.
   * @param to           The user’s email address.
   * @param displayName  The user’s display name.
   */
  async sendSignupEmail(
    to: string,
    displayName: string
  ) {
    return this.transporter.sendMail({
      from: this.config.get<string>('EMAIL'),
      to,
      subject: 'Welcome to Illusia!',
      // @ts-expect-error Property 'template' does not exist on type 'SendMailOptions'.
      template: 'signup',               // uses signup.hbs
      context: { displayName },          // data for template
      attachments: [
        {
          filename: 'logo.png',
          path: path.resolve(__dirname, '../../assets/logo.png'),
          cid: 'logo@illusia',          // matches <img src="cid:logo@illusia">
        },
      ],
    });
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
    endDate?: string
  ) {
    return this.transporter.sendMail({
      from: this.config.get<string>('EMAIL'),
      to,
      subject: 'Your booking has been approved',
      // @ts-expect-error Property 'template' does not exist on type 'SendMailOptions'.
      template: 'bookingApproved',      // uses bookingApproved.hbs
      context: { bookingId, startDate, endDate },
      attachments: [
        {
          filename: 'logo.png',
          path: path.resolve(__dirname, '../../assets/logo.png'),
          cid: 'logo@illusia',
        },
      ],
    });
  }
}