import { PoolClient } from 'pg';
import { BuysRepository } from '../../../../../src/infraestructure/adapters/output/repository/buys';
import { BuyFilter } from '../../../../../src/domain/filters/buys';

describe('BuysRepository', () => {
    let client: PoolClient;
    let buysRepository: BuysRepository;

    beforeEach(() => {
        client = {
            query: jest.fn(),
        } as unknown as PoolClient;
        buysRepository = new BuysRepository(client);
    });

    describe('countAll', () => {
        it('should return the count of all buys', async () => {
            const mockCountResult = { rows: [{ count: '10' }] };
            client.query = jest.fn().mockResolvedValue(mockCountResult);

            const result = await buysRepository.countAll();

            expect(result).toBe(10);
            expect(client.query).toHaveBeenCalledWith('SELECT COUNT(*) FROM buys');
        });
    });

    describe('listAll', () => {
        it('should return a list of buys with filters', async () => {
            const filters: BuyFilter = {
                buyId: 1,
                ingredientId: 2,
                ingredientName: 'Sugar',
                page: 1,
                perPage: 10,
            };

            const mockQueryResult = {
                rows: [
                    { buyid: '1', buyquantity: '10', ingredientid: '2', ingredientname: 'Sugar' },
                    { buyid: '2', buyquantity: '5', ingredientid: '3', ingredientname: 'Salt' },
                ],
            };

            client.query = jest.fn().mockResolvedValue(mockQueryResult);

            const result = await buysRepository.listAll(filters);

            expect(result).toEqual([
                { id: 1, quantity: 10, ingredient: { id: 2, name: 'Sugar' } },
                { id: 2, quantity: 5, ingredient: { id: 3, name: 'Salt' } },
            ]);
            expect(client.query).toHaveBeenCalled();
        });

        it('should build the correct SQL query with filters', async () => {
            const filters: BuyFilter = {
                ingredientId: 2,
                page: 1,
                perPage: 10,
            };

            const mockQueryResult = { rows: [] };
            client.query = jest.fn().mockResolvedValue(mockQueryResult);

            await buysRepository.listAll(filters);

            expect(client.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE'),
                [filters.ingredientId, filters.perPage, 0]
            );
        });

        it('should return an empty array when no buys match the filters', async () => {
            const filters: BuyFilter = {
                ingredientId: 999,
                page: 1,
                perPage: 10,
            };
            const mockQueryResult = { rows: [] };
            client.query = jest.fn().mockResolvedValue(mockQueryResult);

            const result = await buysRepository.listAll(filters);

            expect(result).toEqual([]);
        });
    });
});