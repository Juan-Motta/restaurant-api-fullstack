import { PasswordManager } from '../utils/password'
import { JwtManager } from '../utils/jwt'
import { RabbitMQProducer } from '../adapters/output/rabbitmq/producer'

export async function getPasswordManager() {
    return new PasswordManager()
}

export async function getJwtManager() {
    return new JwtManager()
}

export async function getRabbitMQProducer() {
    return new RabbitMQProducer()
}
