'use strict'

const {createTransport} = require("nodemailer");
const { Service } = require('@hapipal/schmervice');

module.exports = class MailService extends Service {

    constructor() {
        super();
        this.mailer = createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.MAIL_USER ,
                pass: process.env.MAIL_PASS
            }
        })
    }



    async sendMail(to, subject, mail) {
        await this.mailer.sendMail({
            from: 'maya.greenholt@ethereal.email',
            to: to,
            subject: subject,
            text: mail,
            html: "<b>Hello world?</b>",
        })
    }

    async sendMailWithAttachment(to, subject, mail, filePath) {
        await this.mailer.sendMail({
            from: 'maya.greenholt@ethereal.email',
            to: to,
            subject: subject,
            text: mail,
            html: "<b>Hello world?</b>",
            attachments: [
                {
                    filename: 'movies_export.csv',
                    path: filePath
                }
            ]
        })
    }

}
