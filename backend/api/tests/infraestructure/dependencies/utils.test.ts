import {
    getPasswordManager,
    getJwtManager,
    getRabbitMQProducer
} from '../../../src/infraestructure/dependencies/utils'
import { PasswordManager } from '../../../src/infraestructure/utils/password'
import { JwtManager } from '../../../src/infraestructure/utils/jwt'
import { RabbitMQProducer } from '../../../src/infraestructure/adapters/output/rabbitmq/producer'

describe('Utility Functions', () => {
    it('should return an instance of PasswordManager', async () => {
        const passwordManager = await getPasswordManager()
        expect(passwordManager).toBeInstanceOf(PasswordManager)
    })

    it('should return an instance of JwtManager', async () => {
        const jwtManager = await getJwtManager()
        expect(jwtManager).toBeInstanceOf(JwtManager)
    })

    it('should return an instance of RabbitMQProducer', async () => {
        const rabbitMQProducer = await getRabbitMQProducer()
        expect(rabbitMQProducer).toBeInstanceOf(RabbitMQProducer)
    })
})
