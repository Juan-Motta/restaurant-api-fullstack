import amqp from 'amqplib'
import { RabbitMQProducer } from '../../../../../src/infraestructure/adapters/output/rabbitmq/producer'
import Logger from '../../../../../src/infraestructure/config/logger'
import { settings } from '../../../../../src/infraestructure/config/settings'

jest.mock('../../../../../src/infraestructure/config/settings', () => ({
    settings: {
        BROKER_HOST: 'localhost',
        BROKER_PORT: '5672'
    }
}))

jest.mock('amqplib')
jest.mock('../../../../../src/infraestructure/config/logger')

describe('RabbitMQProducer', () => {
    let rabbitMQProducer: RabbitMQProducer

    beforeEach(() => {
        rabbitMQProducer = new RabbitMQProducer()
        jest.clearAllMocks()
    })

    describe('publish', () => {
        it('should publish a message to the specified queue', async () => {
            const mockChannel = {
                assertQueue: jest.fn().mockResolvedValue(undefined),
                sendToQueue: jest.fn(),
                close: jest.fn().mockResolvedValue(undefined)
            }
            const mockConnection = {
                createChannel: jest.fn().mockResolvedValue(mockChannel),
                close: jest.fn().mockResolvedValue(undefined)
            }

            ;(amqp.connect as jest.Mock).mockResolvedValue(mockConnection)

            const queue = 'testQueue'
            const message = { key: 'value' }

            await rabbitMQProducer.publish(queue, message)

            expect(amqp.connect).toHaveBeenCalledWith(`amqp://localhost:5672`)
            expect(mockConnection.createChannel).toHaveBeenCalled()
            expect(mockChannel.assertQueue).toHaveBeenCalledWith(queue, {
                durable: false
            })
            expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
                queue,
                Buffer.from(JSON.stringify(message))
            )
            expect(Logger.info).toHaveBeenCalledWith(
                `Message sent to queue ${queue}`
            )
            expect(mockChannel.close).toHaveBeenCalled()
            expect(mockConnection.close).toHaveBeenCalled()
        })

        it('should throw an error if connection fails', async () => {
            const errorMessage = 'Connection failed'
            ;(amqp.connect as jest.Mock).mockRejectedValue(
                new Error(errorMessage)
            )

            await expect(
                rabbitMQProducer.publish('testQueue', { key: 'value' })
            ).rejects.toThrow(errorMessage)
        })

        it('should throw an error when channel creation fails', async () => {
            const mockConnection = {
                createChannel: jest
                    .fn()
                    .mockRejectedValue(new Error('Channel creation failed')),
                close: jest.fn().mockResolvedValue(undefined)
            }
            ;(amqp.connect as jest.Mock).mockResolvedValue(mockConnection)

            await expect(
                rabbitMQProducer.publish('testQueue', { key: 'value' })
            ).rejects.toThrow('Channel creation failed')
        })
    })
})
