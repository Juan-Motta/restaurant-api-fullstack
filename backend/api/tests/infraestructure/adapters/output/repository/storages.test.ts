import { PoolClient } from 'pg'
import { StorageRepository } from '../../../../../src/infraestructure/adapters/output/repository/storages'
import { IngredientFilter } from '../../../../../src/domain/filters/ingredients'

describe('StorageRepository', () => {
    let client: PoolClient
    let storageRepository: StorageRepository

    beforeEach(() => {
        client = {
            query: jest.fn()
        } as unknown as PoolClient
        storageRepository = new StorageRepository(client)
    })

    describe('countAll', () => {
        it('should return the count of all ingredients', async () => {
            const mockCountResult = { rows: [{ count: '5' }] }
            client.query = jest.fn().mockResolvedValue(mockCountResult)

            const result = await storageRepository.countAll()

            expect(result).toBe(5)
            expect(client.query).toHaveBeenCalledWith(
                'SELECT COUNT(*) FROM ingredients'
            )
        })
    })

    describe('getAllIngredients', () => {
        it('should return all ingredients based on filters', async () => {
            const filters: IngredientFilter = {
                ingredientId: 1,
                ingredientName: 'Sugar',
                page: 1,
                perPage: 10
            }

            const mockQueryResult = {
                rows: [
                    {
                        ingredientid: '1',
                        ingredientname: 'Sugar',
                        ingredientquantity: 100
                    },
                    {
                        ingredientid: '2',
                        ingredientname: 'Salt',
                        ingredientquantity: 50
                    }
                ]
            }

            client.query = jest.fn().mockResolvedValue(mockQueryResult)

            const result = await storageRepository.getAllIngredients(filters)

            expect(result).toEqual([
                { id: '1', name: 'Sugar', quantity: 100 },
                { id: '2', name: 'Salt', quantity: 50 }
            ])
            expect(client.query).toHaveBeenCalled()
        })

        it('should build the correct SQL query with filters', async () => {
            const filters: IngredientFilter = {
                ingredientId: 2,
                ingredientName: 'Salt',
                page: 1,
                perPage: 10
            }

            const mockQueryResult = { rows: [] }
            client.query = jest.fn().mockResolvedValue(mockQueryResult)

            await storageRepository.getAllIngredients(filters)

            expect(client.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE'),
                [
                    filters.ingredientId,
                    `%${filters.ingredientName}%`,
                    filters.perPage,
                    0
                ]
            )
        })

        it('should return an empty array when no ingredients match the filters', async () => {
            const filters: IngredientFilter = {
                ingredientId: 999,
                page: 1,
                perPage: 10
            }
            const mockQueryResult = { rows: [] }
            client.query = jest.fn().mockResolvedValue(mockQueryResult)

            const result = await storageRepository.getAllIngredients(filters)

            expect(result).toEqual([])
        })
    })
})
