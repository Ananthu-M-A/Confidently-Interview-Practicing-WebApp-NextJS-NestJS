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

    async sendExpertMail(to: string, password: string): Promise<void> {
        const mailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to,
            subject: 'You are Now an Expert at Confidently',
            html: `
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h1>Dear Confidently User,</h1>
  <h4>Congratulations! We are thrilled to welcome you as an Expert Professional at Confidently. Your dedication and expertise have brought you to this well-deserved milestone, and we are excited to have you onboard as part of our thriving community.</h4>
  <h4>Below are your login credentials to access your Expert Professional account:</h4>
  <h2>
    <strong>Username:</strong> ${to} <br>
    <strong>Password:</strong> ${password}
  </h2>
  <h4>Please use these credentials to log in to your account and update your password to a secure one at your earliest convenience.</h4>
  <h4>If you encounter any issues or have questions, feel free to contact our support team. We are here to assist you.</h4>
  <h2>Thank you,<br>Confidently</h2>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
  <h6 style="font-size: 12px; color: #777;">This is an automated message. Please do not reply.</h6>
</body>
      `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('New expert welcome email sent');
        } catch (error) {
            console.error('Error sending welcome email:', error);
            throw new Error('Failed to send welcome email');
        }
    }
}
