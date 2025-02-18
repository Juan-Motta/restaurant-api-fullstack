import { StorageService } from '../../../src/application/services/storage'
import { IStorageRepository } from '../../../src/domain/repositories/storages'
import { IngredientFilter } from '../../../src/domain/filters/ingredients'

describe('StorageService', () => {
    let storageService: StorageService
    let storageRepository: IStorageRepository

    beforeEach(() => {
        storageRepository = {
            getAllIngredients: jest.fn(),
            countAll: jest.fn()
        } as unknown as IStorageRepository

        storageService = new StorageService(storageRepository)
    })

    describe('getAllIngredients', () => {
        it('should return all ingredients with pagination info', async () => {
            const filters: IngredientFilter = { page: 1, perPage: 10 }
            const mockData = [
                { id: 1, name: 'Sugar', quantity: 100 },
                { id: 2, name: 'Salt', quantity: 50 }
            ]
            const totalCount = 2

            storageRepository.getAllIngredients = jest
                .fn()
                .mockResolvedValue(mockData)
            storageRepository.countAll = jest.fn().mockResolvedValue(totalCount)

            const result = await storageService.getAllIngredients(filters)

            expect(result).toEqual({
                data: mockData,
                page: filters.page,
                perPage: filters.perPage,
                total: totalCount
            })
            expect(storageRepository.getAllIngredients).toHaveBeenCalledWith(
                filters
            )
            expect(storageRepository.countAll).toHaveBeenCalled()
        })

        it('should handle empty ingredient list', async () => {
            const filters: IngredientFilter = { page: 1, perPage: 10 }
            const mockData: [] = []
            const totalCount = 0

            storageRepository.getAllIngredients = jest
                .fn()
                .mockResolvedValue(mockData)
            storageRepository.countAll = jest.fn().mockResolvedValue(totalCount)

            const result = await storageService.getAllIngredients(filters)

            expect(result).toEqual({
                data: mockData,
                page: filters.page,
                perPage: filters.perPage,
                total: totalCount
            })
            expect(storageRepository.getAllIngredients).toHaveBeenCalledWith(
                filters
            )
            expect(storageRepository.countAll).toHaveBeenCalled()
        })
    })
})
