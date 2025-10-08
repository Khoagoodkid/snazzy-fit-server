import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import { ConfigService } from "@nestjs/config";
import { getAttendeeMailTemplate, getChangePasswordMailTemplate, getWelcomeMailTemplate } from "./templates/mail.template";
import { Api400Error } from "src/core/base.error";
@Injectable()
export class SendMailService {
    private readonly transporter: nodemailer.Transporter;
    constructor(
        private readonly configService: ConfigService
    ) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: this.configService.get('MAIL_USERNAME'),
                pass: this.configService.get('MAIL_PASS'),
            },
        });
    }

    async sendWelcomeMail(to: string[], username: string, verifyLink: string) {
        const html = getWelcomeMailTemplate(username, verifyLink);
        const mailOptions = {
            from: this.configService.get('MAIL_USERNAME'),
            to: to.join(','),
            subject: "Welcome to Snazzy Fits",
            html,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.log(error);
            throw new Api400Error("Failed to send email");
        }
    }

    async sendChangePasswordMail(to: string[], username: string, changePasswordLink: string) {
        const html = getChangePasswordMailTemplate(username, changePasswordLink);
        const mailOptions = {
            from: this.configService.get('MAIL_USERNAME'),
            to: to.join(','),
            subject: "Change Password",
            html,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.log(error);
            throw new Api400Error("Failed to send email");
        }
    }

    async sendMail(to: string[], title: string, body: string) {
        const html = getAttendeeMailTemplate(title, body);
        const mailOptions = {
            from: this.configService.get('MAIL_USERNAME'),
            to: to.join(','),
            subject: title,
            html,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            return mailOptions;
        } catch (error) {
            console.log(error);
            throw new Api400Error("Failed to send email");
        }
    }
}

