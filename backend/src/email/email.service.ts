import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter<SentMessageInfo, Options>;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendResetMail(to: string): Promise<void> {
        const mailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to,
            subject: 'Your Password Has Been Reset',
            html: `
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h1>Dear confidently user,</h1>
    <h4>We received a request to reset your password. Below is your new temporary password:</h4>
    <h2><strong>Temporary Password:</strong> ${this.configService.get<string>('CONFIDENTLY_DEFAULT_PASSWORD')}</h2>
    <h4>Please use this password to log in to your account and change it to a secure password of your choice as soon as possible.</h4>
    <h4>If you didn't request this, please ignore this email or contact our support team immediately.</h4>
    <h2>Thank you,<br>Confidently</h2>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    <h6 style="font-size: 12px; color: #777;">This is an automated message. Please do not reply.</h6>
  </body>
      `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Password reset email sent successfully');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }
}
