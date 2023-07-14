import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';

@Injectable()
export class EmailNotificationService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly username: string,
    private readonly password: string,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: false,
      auth: {
        user: this.username,
        pass: this.password,
      },
    });
  }

  async sendEmailWithAttachment(
    from: string,
    to: string,
    subject: string,
    text: string,
    attachment: Attachment,
  ): Promise<void> {
    const emailOptions = {
      from,
      to,
      subject,
      text,
      attachments: [attachment],
    };

    await this.transporter.sendMail(emailOptions);
  }
}
