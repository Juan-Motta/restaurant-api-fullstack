import { PoolClient } from 'pg'
import {
    getUserService,
    getAuthService,
    getOrderService,
    getStorageService,
    getBuysService,
    getRecipesService
} from '../../../src/infraestructure/dependencies/services'
import { UserService } from '../../../src/application/services/user'
import { AuthService } from '../../../src/application/services/auth'
import { OrdersService } from '../../../src/application/services/orders'
import { StorageService } from '../../../src/application/services/storage'
import { BuysService } from '../../../src/application/services/buys'
import { RecipesService } from '../../../src/application/services/recipes'
import {
    getUserRepository,
    getOrderRepository,
    getRecipeRepository,
    getStorageRespository,
    getBuysRepository,
    getEventsLogsRepository
} from '../../../src/infraestructure/dependencies/repositories'
import {
    getJwtManager,
    getPasswordManager,
    getRabbitMQProducer
} from '../../../src/infraestructure/dependencies/utils'

jest.mock('../../../src/infraestructure/dependencies/repositories', () => ({
    getUserRepository: jest.fn(),
    getOrderRepository: jest.fn(),
    getRecipeRepository: jest.fn(),
    getStorageRespository: jest.fn(),
    getBuysRepository: jest.fn(),
    getEventsLogsRepository: jest.fn()
}))

jest.mock('../../../src/infraestructure/dependencies/utils', () => ({
    getJwtManager: jest.fn(),
    getPasswordManager: jest.fn(),
    getRabbitMQProducer: jest.fn()
}))

describe('Service Factory Functions', () => {
    let mockClient: PoolClient

    beforeEach(() => {
        mockClient = {
            query: jest.fn()
        } as unknown as PoolClient
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return an instance of UserService', async () => {
        ;(getUserRepository as jest.Mock).mockResolvedValue({})
        ;(getPasswordManager as jest.Mock).mockResolvedValue({})

        const userService = await getUserService(mockClient)
        expect(userService).toBeInstanceOf(UserService)
    })

    it('should return an instance of AuthService', async () => {
        ;(getUserRepository as jest.Mock).mockResolvedValue({})
        ;(getPasswordManager as jest.Mock).mockResolvedValue({})
        ;(getJwtManager as jest.Mock).mockResolvedValue({})

        const authService = await getAuthService(mockClient)
        expect(authService).toBeInstanceOf(AuthService)
    })

    it('should return an instance of OrdersService', async () => {
        ;(getOrderRepository as jest.Mock).mockResolvedValue({})
        ;(getRecipeRepository as jest.Mock).mockResolvedValue({})
        ;(getRabbitMQProducer as jest.Mock).mockResolvedValue({})
        ;(getEventsLogsRepository as jest.Mock).mockResolvedValue({})

        const orderService = await getOrderService(mockClient)
        expect(orderService).toBeInstanceOf(OrdersService)
    })

    it('should return an instance of StorageService', async () => {
        ;(getStorageRespository as jest.Mock).mockResolvedValue({})

        const storageService = await getStorageService(mockClient)
        expect(storageService).toBeInstanceOf(StorageService)
    })

    it('should return an instance of BuysService', async () => {
        ;(getBuysRepository as jest.Mock).mockResolvedValue({})

        const buysService = await getBuysService(mockClient)
        expect(buysService).toBeInstanceOf(BuysService)
    })

    it('should return an instance of RecipesService', async () => {
        ;(getRecipeRepository as jest.Mock).mockResolvedValue({})

        const recipesService = await getRecipesService(mockClient)
        expect(recipesService).toBeInstanceOf(RecipesService)
    })
})
