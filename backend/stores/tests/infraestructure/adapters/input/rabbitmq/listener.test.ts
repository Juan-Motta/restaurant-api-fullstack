import amqp from 'amqplib';
import { RabbitMQListener } from '../../../../../src/infraestructure/adapters/input/rabbitmq/listener';
import { db } from '../../../../../src/infraestructure/adapters/output/database/index';
import Logger from '../../../../../src/infraestructure/config/logger';
import { getStorageService } from '../../../../../src/infraestructure/dependencies/services';
import { getEventsLogsRepository } from '../../../../../src/infraestructure/dependencies/repositories';
import { Events } from '../../../../../src/domain/constants/events';
import { EventLogsState } from '../../../../../src/domain/constants/logsStates';

jest.mock('amqplib');
jest.mock('../../../../../src/infraestructure/config/logger');
jest.mock('../../../../../src/infraestructure/dependencies/services');
jest.mock('../../../../../src/infraestructure/dependencies/repositories');
jest.mock('../../../../../src/infraestructure/adapters/output/database/index');

jest.mock('../../../../../src/infraestructure/config/settings', () => ({
    settings: {
        BROKER_HOST: 'localhost',
        BROKER_PORT: '5672',
    },
}));

describe('RabbitMQListener', () => {
    let rabbitMQListener: RabbitMQListener;

    beforeEach(() => {
        rabbitMQListener = new RabbitMQListener();
        jest.clearAllMocks();
    });

    describe('handler', () => {
        it('should handle CREATE_ORDER message and prepare ingredients', async () => {
            const mockMessage = {
                event: Events.CREATE_ORDER,
                data: { orderId: 1 },
            };

            const mockClient = {
                release: jest.fn(),
            };

            const mockEventsLogsRepository = {
                create: jest.fn().mockResolvedValue(undefined),
            };

            const mockStorageService = {
                prepareIngrtedients: jest.fn().mockResolvedValue(undefined),
            };

            (db.connect as jest.Mock).mockResolvedValue(mockClient);
            (getEventsLogsRepository as jest.Mock).mockResolvedValue(mockEventsLogsRepository);
            (getStorageService as jest.Mock).mockResolvedValue(mockStorageService);

            await rabbitMQListener.handler(mockMessage as any);

            expect(mockEventsLogsRepository.create).toHaveBeenCalledWith(
                Events.CREATE_ORDER,
                mockMessage,
                EventLogsState.RECEIVED,
                null
            );
            expect(mockStorageService.prepareIngrtedients).toHaveBeenCalledWith(mockMessage.data.orderId);
            expect(mockClient.release).toHaveBeenCalled();
        });

        it('should handle errors when preparing ingredients', async () => {
            const mockMessage = {
                event: Events.CREATE_ORDER,
                data: { orderId: 1 },
            };

            const mockClient = {
                release: jest.fn(),
            };

            const mockEventsLogsRepository = {
                create: jest.fn().mockResolvedValue(undefined),
            };

            (db.connect as jest.Mock).mockResolvedValue(mockClient);
            (getEventsLogsRepository as jest.Mock).mockResolvedValue(mockEventsLogsRepository);
            (getStorageService as jest.Mock).mockResolvedValue({
                prepareIngrtedients: jest.fn().mockRejectedValue(new Error('Preparation error')),
            });

            await rabbitMQListener.handler(mockMessage as any);

            expect(mockEventsLogsRepository.create).toHaveBeenCalledWith(
                Events.CREATE_ORDER,
                mockMessage,
                EventLogsState.RECEIVED,
                null
            );
            expect(mockClient.release).toHaveBeenCalled();
        });
    });

    describe('listen', () => {
        it('should set up the AMQP connection and channel', async () => {
            const mockChannel = {
                assertQueue: jest.fn().mockResolvedValue(undefined),
                consume: jest.fn(),
                close: jest.fn().mockResolvedValue(undefined),
            };
            const mockConnection = {
                createChannel: jest.fn().mockResolvedValue(mockChannel),
                close: jest.fn().mockResolvedValue(undefined),
            };

            (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);

            await rabbitMQListener.listen('STORE_QUEUE');

            expect(amqp.connect).toHaveBeenCalledWith(
                `amqp://localhost:5672`
            );
            expect(mockChannel.assertQueue).toHaveBeenCalledWith('STORE_QUEUE', { durable: false });
        });
    });
});