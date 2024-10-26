import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS // Your app password or regular password
      }
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `${token}`; // Update with your frontend URL
    await this.transporter.sendMail({
      from: `no replay" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Account Verification",
      html: `<p>Please click the following link to verify your account:</p><a href="${url}">${url}</a>`
    });
  }
}
