const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

const QUEUE_NAME = 'movie_exports';

async function consumeQueue() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.consume(QUEUE_NAME, async (msg) => {
        if (msg !== null) {
            const { filePath, email } = JSON.parse(msg.content.toString());

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'abelardo.hilll@ethereal.email',
                    pass: 'v7YTN1SBCfYrxJwcDz'
                }
            });
            const mailOptions = {
                from: 'Movies Export <noreply@movies.com>',
                to: email,
                subject: 'Export CSV des Films',
                text: 'Voici l’export des films en CSV.',
                attachments: [
                    {
                        filename: 'movies_export.csv',
                        path: filePath
                    }
                ]
            };

            try {
                await transporter.sendMail(mailOptions)
            } catch (error) {
                console.error(error);
            }

            fs.unlinkSync(filePath);

            channel.ack(msg);
        }
    });
}

consumeQueue().catch(console.error);
