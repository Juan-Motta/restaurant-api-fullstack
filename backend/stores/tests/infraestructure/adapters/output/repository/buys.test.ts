import { PoolClient } from 'pg';
import { BuysRepository } from '../../../../../src/infraestructure/adapters/output/repository/buys';
import { IBuysRepository } from '../../../../../src/domain/repositories/buys';

describe('BuysRepository', () => {
    let client: PoolClient;
    let buysRepository: IBuysRepository;

    beforeEach(() => {
        client = {
            query: jest.fn(),
        } as unknown as PoolClient;
        buysRepository = new BuysRepository(client);
    });

    describe('create', () => {
        it('should insert a buy into the database', async () => {
            const ingredientId = 1;
            const quantity = 10;
            
            client.query = jest.fn().mockResolvedValue(undefined);

            await buysRepository.create(ingredientId, quantity);

            expect(client.query).toHaveBeenCalledWith(
                'INSERT INTO buys (ingredient_id, quantity) VALUES ($1, $2);',
                [ingredientId, quantity]
            );
        });
    });
});