import { BuysService } from '../../../src/application/services/buys'
import { BuyFilter } from '../../../src/domain/filters/buys'
import { IBuysRepository } from '../../../src/domain/repositories/buys'
import { Buy } from '../../../src/domain/entities/buys'

describe('BuysService', () => {
    let buysService: BuysService
    let buysRepository: IBuysRepository

    beforeEach(() => {
        buysRepository = {
            listAll: jest.fn(),
            countAll: jest.fn()
        } as unknown as IBuysRepository

        buysService = new BuysService(buysRepository)
    })

    describe('listAllBuys', () => {
        it('should return all buys with pagination info', async () => {
            const filters: BuyFilter = { page: 1, perPage: 10 }
            const mockData = [
                { id: 1, item: 'Item 1' },
                { id: 2, item: 'Item 2' }
            ]
            const totalCount = 2

            buysRepository.listAll = jest.fn().mockResolvedValue(mockData)
            buysRepository.countAll = jest.fn().mockResolvedValue(totalCount)

            const result = await buysService.listAllBuys(filters)

            expect(result).toEqual({
                data: mockData,
                page: filters.page,
                perPage: filters.perPage,
                total: totalCount
            })
            expect(buysRepository.listAll).toHaveBeenCalledWith(filters)
            expect(buysRepository.countAll).toHaveBeenCalled()
        })

        it('should handle empty results', async () => {
            const filters: BuyFilter = { page: 1, perPage: 10 }
            const mockData: Buy[] = []
            const totalCount = 0

            buysRepository.listAll = jest.fn().mockResolvedValue(mockData)
            buysRepository.countAll = jest.fn().mockResolvedValue(totalCount)

            const result = await buysService.listAllBuys(filters)

            expect(result).toEqual({
                data: mockData,
                page: filters.page,
                perPage: filters.perPage,
                total: totalCount
            })
            expect(buysRepository.listAll).toHaveBeenCalledWith(filters)
            expect(buysRepository.countAll).toHaveBeenCalled()
        })

        it('should handle repository errors', async () => {
            const filters: BuyFilter = { page: 1, perPage: 10 }

            buysRepository.listAll = jest
                .fn()
                .mockRejectedValue(new Error('Database error'))
            buysRepository.countAll = jest.fn().mockResolvedValue(0)

            await expect(buysService.listAllBuys(filters)).rejects.toThrow(
                'Database error'
            )
        })
    })
})
