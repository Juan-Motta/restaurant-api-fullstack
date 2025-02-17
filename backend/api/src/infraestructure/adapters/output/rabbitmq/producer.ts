import amqp from 'amqplib'

import { settings } from '../../../config/settings'
import { IRabbitMQProducer } from '../../../../domain/adapters/rabbitmq'
import Logger from '../../../config/logger'

export class RabbitMQProducer implements IRabbitMQProducer {
    async publish(queue: string, message: object) {
        const connection = await amqp.connect(
            `amqp://${settings.BROKER_HOST}:${settings.BROKER_PORT}`
        )

        const channel = await connection.createChannel()

        await channel.assertQueue(queue, { durable: false })

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
        Logger.info(`Message sent to queue ${queue}`)

        await channel.close()

        if (connection) await connection.close()
    }
}
