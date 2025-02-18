import { PoolClient } from 'pg'
import { getStorageService } from '../../../src/infraestructure/dependencies/services'
import { StorageService } from '../../../src/application/services/storage'
import {
    getRecipeRepository,
    getOrderRepository,
    getEventsLogsRepository,
    getBuysRepository,
    getStorageRespository
} from '../../../src/infraestructure/dependencies/repositories'
import {
    getHttpAdapter,
    getRabbitMQProducer
} from '../../../src/infraestructure/dependencies/utils'
import { HttpAdapter } from '../../../src/infraestructure/adapters/output/http/request'
import { RabbitMQProducer } from '../../../src/infraestructure/adapters/output/rabbitmq/producer'

jest.mock('../../../src/infraestructure/dependencies/repositories', () => ({
    getRecipeRepository: jest.fn(),
    getOrderRepository: jest.fn(),
    getEventsLogsRepository: jest.fn(),
    getBuysRepository: jest.fn(),
    getStorageRespository: jest.fn()
}))

jest.mock('../../../src/infraestructure/dependencies/utils', () => ({
    getHttpAdapter: jest.fn(),
    getRabbitMQProducer: jest.fn()
}))

describe('StorageService Factory Function', () => {
    let mockClient: PoolClient

    beforeEach(() => {
        mockClient = {
            query: jest.fn()
        } as unknown as PoolClient
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return an instance of StorageService', async () => {
        const mockHttpAdapter = new HttpAdapter()
        const mockRecipeRepository = {}
        const mockBuysRepository = {}
        const mockOrderRepository = {}
        const mockStorageRepository = {}
        const mockRabbitMQProducer = new RabbitMQProducer()
        const mockEventsLogsRepository = {}

        ;(getHttpAdapter as jest.Mock).mockResolvedValue(mockHttpAdapter)
        ;(getRecipeRepository as jest.Mock).mockResolvedValue(
            mockRecipeRepository
        )
        ;(getBuysRepository as jest.Mock).mockResolvedValue(mockBuysRepository)
        ;(getOrderRepository as jest.Mock).mockResolvedValue(
            mockOrderRepository
        )
        ;(getStorageRespository as jest.Mock).mockResolvedValue(
            mockStorageRepository
        )
        ;(getRabbitMQProducer as jest.Mock).mockResolvedValue(
            mockRabbitMQProducer
        )
        ;(getEventsLogsRepository as jest.Mock).mockResolvedValue(
            mockEventsLogsRepository
        )

        const storageService = await getStorageService(mockClient)

        expect(storageService).toBeInstanceOf(StorageService)
        expect(getHttpAdapter).toHaveBeenCalled()
        expect(getRecipeRepository).toHaveBeenCalledWith(mockClient)
        expect(getBuysRepository).toHaveBeenCalledWith(mockClient)
        expect(getOrderRepository).toHaveBeenCalledWith(mockClient)
        expect(getStorageRespository).toHaveBeenCalledWith(mockClient)
        expect(getRabbitMQProducer).toHaveBeenCalled()
        expect(getEventsLogsRepository).toHaveBeenCalledWith(mockClient)
    })
})
