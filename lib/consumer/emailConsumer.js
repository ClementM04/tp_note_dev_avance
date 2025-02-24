const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

const mailer = require('../services/mailer')

const QUEUE_NAME = 'movie_exports';

async function consumeQueue() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.consume(QUEUE_NAME, async (msg) => {
        if (msg !== null) {
            const { filePath, email } = JSON.parse(msg.content.toString());

            const mailerInstance = new mailer()

            try {
                await mailerInstance.sendMailWithAttachment(email, 'Export CSV des Films', 'Voici l’export des films en CSV.', filePath)
            } catch (error) {
                console.error(error);
            }

            fs.unlinkSync(filePath);

            channel.ack(msg);
        }
    });
}

consumeQueue().catch(console.error);
