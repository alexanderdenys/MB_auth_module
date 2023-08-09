import nodemailer from 'nodemailer';

class NotificationService {
  constructor(emailConfig) {
    this.transporter = nodemailer.createTransport(emailConfig);
  }

  async sendEmail(options) {
    return this.transporter.sendMail(options);
  }
}

export default NotificationService;
