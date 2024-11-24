const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(fullName, email) {
    this.to = process.env.GMAIL_USERNAME;
    this.firstName = fullName.split(' ')[0];
    this.from = email;
  }
  newTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async sendMessage(message, template = 'contact') {
    const subject = 'We would like to contact you';
    const html = pug.renderFile(
      `${__dirname}/../views/${template}.pug`,
      {
        firstName: this.firstName,
        subject,
        message,
      },
    );

    const mailOptions = {
      from: `${this.firstName} <${this.from}>`,
      to: this.to,
      subject,
      html,
      text: convert(html, {
        wordwrap: 130,
      }),
      replyTo: this.from,
    };
    const info =
      await this.newTransport().sendMail(mailOptions);
    return info.messageId;
  }

  async sendReply() {
    const subject =
      'Thank you for contacting Maraki Fashion';
    const html = pug.renderFile(
      `${__dirname}/../views/confirmation.pug`,
      {
        firstName: 'Maraki Fashion',
        subject,
      },
    );

    const mailOptions = {
      from: `Maraki Fashion <${process.env.GMAIL_USERNAME}>`,
      to: this.from, // Send reply to the sender's email
      subject,
      html,
      text: convert(html, { wordwrap: 130 }),
      // headers: {
      //   'In-Reply-To': originalMessageId,
      //   References: originalMessageId,
      // },
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendPaymentUrl(
    url,
    transactionId,
    template = 'makePayment',
  ) {
    const subject =
      'Make payments on chapa as soon as possible';
    const html = pug.renderFile(
      `${__dirname}/../views/${template}.pug`,
      {
        // firstName: this.firstName,
        subject,
        url,
        transactionId,
      },
    );

    const mailOptions = {
      from: `MarakiFashion <${this.to}>`,
      to: this.from,
      subject,
      html,
      text: convert(html, {
        wordwrap: 130,
      }),
    };
    const info =
      await this.newTransport().sendMail(mailOptions);
    return info.messageId;
  }
  async sendPaymentSuccessfullMessage(
    template = 'paymentSuccessful',
  ) {
    const subject =
      'Payment Confirmed! Your Order is on the Way!';
    const html = pug.renderFile(
      `${__dirname}/../views/${template}.pug`,
      {
        subject,
      },
    );

    const mailOptions = {
      from: `MarakiFashion <${this.to}>`,
      to: this.from,
      subject,
      html,
      text: convert(html, {
        wordwrap: 130,
      }),
    };
    const info =
      await this.newTransport().sendMail(mailOptions);
    return info.messageId;
  }
};
