import { PoolClient } from 'pg';
import { StorageRepository } from '../../../../../src/infraestructure/adapters/output/repository/storages';
import { Ingredient } from '../../../../../src/domain/entities/ingredients';

describe('StorageRepository', () => {
    let client: PoolClient;
    let storageRepository: StorageRepository;

    beforeEach(() => {
        client = {
            query: jest.fn(),
        } as unknown as PoolClient;
        storageRepository = new StorageRepository(client);
    });

    describe('getAllIngredients', () => {
        it('should return all ingredients from the database', async () => {
            const mockQueryResult = {
                rows: [
                    { id: 1, name: 'Sugar' },
                    { id: 2, name: 'Salt' },
                ],
            };

            client.query = jest.fn().mockResolvedValue(mockQueryResult);

            const result: Ingredient[] = await storageRepository.getAllIngredients();

            expect(result).toEqual([
                { id: 1, name: 'Sugar' },
                { id: 2, name: 'Salt' },
            ]);
            expect(client.query).toHaveBeenCalledWith('SELECT * FROM ingredients;');
        });
    });

    describe('updateIngredientQuantity', () => {
        it('should update the quantity of the specified ingredient', async () => {
            const ingredientId = 1;
            const quantity = 10;

            client.query = jest.fn().mockResolvedValue(undefined);

            await storageRepository.updateIngredientQuantity(ingredientId, quantity);
        });
    });

    describe('removeIngredientsFromStorage', () => {
        it('should remove ingredients based on the recipe ID', async () => {
            const recipeId = 2;

            client.query = jest.fn().mockResolvedValue(undefined);

            await storageRepository.removeIngredientsFromStorage(recipeId);
        });
    });
});