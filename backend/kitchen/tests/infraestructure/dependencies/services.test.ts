import { PoolClient } from 'pg'
import { getKitchenService } from '../../../src/infraestructure/dependencies/services'
import { KitchenService } from '../../../src/application/services/kitchen'
import {
    getOrderRepository,
    getSorageRepository
} from '../../../src/infraestructure/dependencies/repositories'

jest.mock('../../../src/infraestructure/dependencies/repositories', () => ({
    getOrderRepository: jest.fn(),
    getSorageRepository: jest.fn()
}))

describe('KitchenService Factory Function', () => {
    let mockClient: PoolClient

    beforeEach(() => {
        mockClient = {
            query: jest.fn()
        } as unknown as PoolClient
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return an instance of KitchenService', async () => {
        const mockOrderRepository = {}
        const mockStorageRepository = {}

        ;(getOrderRepository as jest.Mock).mockResolvedValue(
            mockOrderRepository
        )
        ;(getSorageRepository as jest.Mock).mockResolvedValue(
            mockStorageRepository
        )

        const kitchenService = await getKitchenService(mockClient)

        expect(kitchenService).toBeInstanceOf(KitchenService)
        expect(getOrderRepository).toHaveBeenCalledWith(mockClient)
        expect(getSorageRepository).toHaveBeenCalledWith(mockClient)
    })
})
