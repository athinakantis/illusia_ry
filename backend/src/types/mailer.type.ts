export interface SendMailOptions {
      from?: string;
      to?: string;
      subject?: string;
      text?: string;
      html?: string;
      attachments?: Array<{
      filename: string;
      path: string;
      cid?: string;
      template?: string;
      }>;
      [key: string]: unknown;
    }