const nodemailer = require('nodemailer');
// const values = require('../_secret');
require("dotenv").config();

class MailService {

  constructor() {
    this.transporter = nodemailer.createTransport({
      // service: 'gmail',
      // host: values.SMTP_HOST,
      // port: values.SMTP_PORT,
      // secure: false,
      // auth: {
      //   user: values.SMTP_USER,
      //   pass: values.SMTP_PASS,
      // },

      // service: 'Yandex',
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Информация о входе`,
      text: '',
      html: `
        <div>
          <h1>Для активации перейдите по ссылке:</h1>
          <a href="${link}">${link}</a>
        </div> `
    })
  }
}

module.exports = new MailService();