import { KitchenService } from '../../../src/application/services/kitchen'
import { IOrderRepository } from '../../../src/domain/repositories/orders'
import { IStorageRepository } from '../../../src/domain/repositories/storages'
import { OrderStatus } from '../../../src/domain/entities/orders'
import Logger from '../../../src/infraestructure/config/logger'

jest.mock('../../../src/infraestructure/config/logger')

describe('KitchenService', () => {
    let kitchenService: KitchenService
    let orderRepository: IOrderRepository
    let storageRepository: IStorageRepository

    beforeEach(() => {
        orderRepository = {
            findById: jest.fn(),
            updateStatus: jest.fn()
        } as unknown as IOrderRepository

        storageRepository = {
            removeIngredientsFromStorage: jest.fn()
        } as unknown as IStorageRepository

        kitchenService = new KitchenService(orderRepository, storageRepository)
    })

    describe('prepareOrder', () => {
        it('should log and do nothing if order is not found', async () => {
            orderRepository.findById = jest.fn().mockResolvedValue(null)

            await kitchenService.prepareOrder(1)

            expect(Logger.info).toHaveBeenCalledWith('Order 1 not found')
            expect(
                storageRepository.removeIngredientsFromStorage
            ).not.toHaveBeenCalled()
            expect(orderRepository.updateStatus).not.toHaveBeenCalled()
        })

        it('should prepare the order and update status', async () => {
            const mockOrder = {
                id: 1,
                recipe: { id: 2, name: 'Pasta' },
                status: OrderStatus.PREPARING
            }

            orderRepository.findById = jest.fn().mockResolvedValue(mockOrder)
            storageRepository.removeIngredientsFromStorage = jest
                .fn()
                .mockResolvedValue(undefined)
            orderRepository.updateStatus = jest
                .fn()
                .mockResolvedValue(undefined)

            await kitchenService.prepareOrder(mockOrder.id)

            expect(Logger.info).toHaveBeenCalledWith(
                `Removing ingredients from storage for order ${mockOrder.id}`
            )
            expect(
                storageRepository.removeIngredientsFromStorage
            ).toHaveBeenCalledWith(mockOrder.recipe.id)
            expect(Logger.info).toHaveBeenCalledWith(
                `Order ${mockOrder.id} prepared`
            )
            expect(orderRepository.updateStatus).toHaveBeenCalledWith(
                mockOrder.id,
                OrderStatus.FINISHED
            )
        })
    })
})
