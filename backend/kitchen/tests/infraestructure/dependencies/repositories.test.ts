import { PoolClient } from 'pg';
import { getOrderRepository, getSorageRepository, getEventsLogsRepository } from '../../../src/infraestructure/dependencies/repositories';
import { OrderRepository } from '../../../src/infraestructure/adapters/output/repository/orders';
import { StorageRepository } from '../../../src/infraestructure/adapters/output/repository/storages';
import { EventsLogsRepository } from '../../../src/infraestructure/adapters/output/repository/eventsLogs';

describe('Repository Factory Functions', () => {
    let mockClient: PoolClient;

    beforeEach(() => {
        mockClient = {
            query: jest.fn(),
        } as unknown as PoolClient;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an instance of OrderRepository', async () => {
        const orderRepository = await getOrderRepository(mockClient);
        expect(orderRepository).toBeInstanceOf(OrderRepository);
    });

    it('should return an instance of StorageRepository', async () => {
        const storageRepository = await getSorageRepository(mockClient);
        expect(storageRepository).toBeInstanceOf(StorageRepository);
    });

    it('should return an instance of EventsLogsRepository', async () => {
        const eventsLogsRepository = await getEventsLogsRepository(mockClient);
        expect(eventsLogsRepository).toBeInstanceOf(EventsLogsRepository);
    });
});