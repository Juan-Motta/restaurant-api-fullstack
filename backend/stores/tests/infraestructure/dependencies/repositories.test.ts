import { PoolClient } from 'pg'
import {
    getOrderRepository,
    getRecipeRepository,
    getEventsLogsRepository,
    getBuysRepository,
    getStorageRespository
} from '../../../src/infraestructure/dependencies/repositories'
import { OrderRepository } from '../../../src/infraestructure/adapters/output/repository/orders'
import { RecipeRepository } from '../../../src/infraestructure/adapters/output/repository/recipes'
import { EventsLogsRepository } from '../../../src/infraestructure/adapters/output/repository/eventsLogs'
import { BuysRepository } from '../../../src/infraestructure/adapters/output/repository/buys'
import { StorageRepository } from '../../../src/infraestructure/adapters/output/repository/storages'

jest.mock('../../../src/infraestructure/adapters/output/repository/orders')
jest.mock('../../../src/infraestructure/adapters/output/repository/recipes')
jest.mock('../../../src/infraestructure/adapters/output/repository/eventsLogs')
jest.mock('../../../src/infraestructure/adapters/output/repository/buys')
jest.mock('../../../src/infraestructure/adapters/output/repository/storages')

describe('Repository Factory Functions', () => {
    let mockClient: PoolClient

    beforeEach(() => {
        mockClient = {
            query: jest.fn()
        } as unknown as PoolClient
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return an instance of OrderRepository', async () => {
        const orderRepository = await getOrderRepository(mockClient)
        expect(orderRepository).toBeInstanceOf(OrderRepository)
    })

    it('should return an instance of RecipeRepository', async () => {
        const recipeRepository = await getRecipeRepository(mockClient)
        expect(recipeRepository).toBeInstanceOf(RecipeRepository)
    })

    it('should return an instance of EventsLogsRepository', async () => {
        const eventsLogsRepository = await getEventsLogsRepository(mockClient)
        expect(eventsLogsRepository).toBeInstanceOf(EventsLogsRepository)
    })

    it('should return an instance of BuysRepository', async () => {
        const buysRepository = await getBuysRepository(mockClient)
        expect(buysRepository).toBeInstanceOf(BuysRepository)
    })

    it('should return an instance of StorageRepository', async () => {
        const storageRepository = await getStorageRespository(mockClient)
        expect(storageRepository).toBeInstanceOf(StorageRepository)
    })
})
