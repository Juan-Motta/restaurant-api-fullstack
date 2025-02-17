import { RabbitMQProducer } from '../adapters/output/rabbitmq/producer'
import { HttpAdapter } from '../adapters/output/http/request'

export async function getRabbitMQProducer() {
    return new RabbitMQProducer()
}

export async function getHttpAdapter() {
    return new HttpAdapter()
}
