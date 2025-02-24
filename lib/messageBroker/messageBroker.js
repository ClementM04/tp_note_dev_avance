const amqp = require('amqplib');

async function publishToQueue(queue, message) {
    let connection, channel;

    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: true });

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
            persistent: true
        });

    } catch (error) {
        console.error(error);
    } finally {
        if (channel) {
            await channel.close();
        }
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = { publishToQueue };
