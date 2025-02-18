import amqp from 'amqplib'
import { RabbitMQListener } from '../../../../../src/infraestructure/adapters/input/rabbitmq/listener'
import { db } from '../../../../../src/infraestructure/adapters/output/database/index'
import Logger from '../../../../../src/infraestructure/config/logger'
import { getKitchenService } from '../../../../../src/infraestructure/dependencies/services'
import { getEventsLogsRepository } from '../../../../../src/infraestructure/dependencies/repositories'
import { Events } from '../../../../../src/domain/constants/events'
import { EventLogsState } from '../../../../../src/domain/constants/logsStates'

jest.mock('amqplib')
jest.mock('../../../../../src/infraestructure/config/logger')
jest.mock('../../../../../src/infraestructure/dependencies/services')
jest.mock('../../../../../src/infraestructure/dependencies/repositories')
jest.mock('../../../../../src/infraestructure/adapters/output/database/index')

describe('RabbitMQListener', () => {
    let rabbitMQListener: RabbitMQListener

    beforeEach(() => {
        rabbitMQListener = new RabbitMQListener()
        jest.clearAllMocks()
    })

    describe('handler', () => {
        it('should prepare order and log it', async () => {
            const mockMessage: any = {
                event: Events.PREPARE_ORDER,
                data: { orderId: 1 }
            }
            const mockClient = {
                release: jest.fn()
            }
            const mockEventsLogsRepository = {
                create: jest.fn().mockResolvedValue(undefined)
            }
            const mockStorageService = {
                prepareOrder: jest.fn().mockResolvedValue(undefined)
            }

            ;(db.connect as jest.Mock).mockResolvedValue(mockClient)
            ;(getEventsLogsRepository as jest.Mock).mockResolvedValue(
                mockEventsLogsRepository
            )
            ;(getKitchenService as jest.Mock).mockResolvedValue(
                mockStorageService
            )

            await rabbitMQListener.handler(mockMessage)

            expect(Logger.info).toHaveBeenCalledWith(
                `Preparing order ${mockMessage.data.orderId}`
            )
            expect(mockEventsLogsRepository.create).toHaveBeenCalledWith(
                Events.PREPARE_ORDER,
                mockMessage,
                EventLogsState.RECEIVED,
                null
            )
            expect(mockStorageService.prepareOrder).toHaveBeenCalledWith(
                mockMessage.data.orderId
            )
            expect(mockClient.release).toHaveBeenCalled()
        })

        it('should handle errors when preparing an order', async () => {
            const mockMessage: any = {
                event: Events.PREPARE_ORDER,
                data: { orderId: 1 }
            }

            const mockClient = {
                release: jest.fn()
            }
            const mockEventsLogsRepository = {
                create: jest.fn().mockResolvedValue(undefined)
            }

            ;(db.connect as jest.Mock).mockResolvedValue(mockClient)
            ;(getEventsLogsRepository as jest.Mock).mockResolvedValue(
                mockEventsLogsRepository
            )
            ;(getKitchenService as jest.Mock).mockResolvedValue({
                prepareOrder: jest
                    .fn()
                    .mockRejectedValue(new Error('Preparation error'))
            })

            await rabbitMQListener.handler(mockMessage)

            expect(mockEventsLogsRepository.create).toHaveBeenCalledWith(
                Events.PREPARE_ORDER,
                mockMessage,
                EventLogsState.RECEIVED,
                null
            )
            expect(mockClient.release).toHaveBeenCalled()
        })
    })

    describe('listen', () => {
        it('should set up the AMQP connection and channel', async () => {
            const mockChannel = {
                assertQueue: jest.fn().mockResolvedValue(undefined),
                consume: jest.fn(),
                close: jest.fn().mockResolvedValue(undefined)
            }
            const mockConnection = {
                createChannel: jest.fn().mockResolvedValue(mockChannel),
                close: jest.fn().mockResolvedValue(undefined)
            }

            ;(amqp.connect as jest.Mock).mockResolvedValue(mockConnection)

            await rabbitMQListener.listen('testQueue')

            expect(amqp.connect).toHaveBeenCalledWith(`amqp://localhost:5672`)
            expect(mockChannel.assertQueue).toHaveBeenCalledWith('testQueue', {
                durable: false
            })
            expect(Logger.info).toHaveBeenCalledWith(
                `Waiting for messages in queue testQueue`
            )
        })
    })
})
