import { PoolClient } from 'pg';
import { 
    getUserRepository, 
    getOrderRepository, 
    getRecipeRepository, 
    getBuysRepository, 
    getStorageRespository, 
    getEventsLogsRepository 
} from '../../../src/infraestructure/dependencies/repositories';
import { UserRepository } from '../../../src/infraestructure/adapters/output/repository/users';
import { OrderRepository } from '../../../src/infraestructure/adapters/output/repository/orders';
import { RecipeRepository } from '../../../src/infraestructure/adapters/output/repository/recipes';
import { BuysRepository } from '../../../src/infraestructure/adapters/output/repository/buys';
import { StorageRepository } from '../../../src/infraestructure/adapters/output/repository/storages';
import { EventsLogsRepository } from '../../../src/infraestructure/adapters/output/repository/eventsLogs';

describe('Repository Factory Functions', () => {
    let mockClient: PoolClient;

    beforeEach(() => {
        mockClient = {
            query: jest.fn(),
        } as unknown as PoolClient;
    });

    it('should return an instance of UserRepository', async () => {
        const userRepository = await getUserRepository(mockClient);
        expect(userRepository).toBeInstanceOf(UserRepository);
    });

    it('should return an instance of OrderRepository', async () => {
        const orderRepository = await getOrderRepository(mockClient);
        expect(orderRepository).toBeInstanceOf(OrderRepository);
    });

    it('should return an instance of RecipeRepository', async () => {
        const recipeRepository = await getRecipeRepository(mockClient);
        expect(recipeRepository).toBeInstanceOf(RecipeRepository);
    });

    it('should return an instance of BuysRepository', async () => {
        const buysRepository = await getBuysRepository(mockClient);
        expect(buysRepository).toBeInstanceOf(BuysRepository);
    });

    it('should return an instance of StorageRepository', async () => {
        const storageRepository = await getStorageRespository(mockClient);
        expect(storageRepository).toBeInstanceOf(StorageRepository);
    });

    it('should return an instance of EventsLogsRepository', async () => {
        const eventsLogsRepository = await getEventsLogsRepository(mockClient);
        expect(eventsLogsRepository).toBeInstanceOf(EventsLogsRepository);
    });
});