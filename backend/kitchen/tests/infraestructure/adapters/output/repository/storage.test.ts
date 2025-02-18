import { PoolClient } from 'pg';
import { StorageRepository } from '../../../../../src/infraestructure/adapters/output/repository/storages';

describe('StorageRepository', () => {
    let client: PoolClient;
    let storageRepository: StorageRepository;

    beforeEach(() => {
        client = {
            query: jest.fn(),
        } as unknown as PoolClient;
        storageRepository = new StorageRepository(client);
    });

    describe('updateIngredientQuantity', () => {
        it('should update the quantity of the specified ingredient', async () => {
            const ingredientId = 1;
            const quantity = 10;

            client.query = jest.fn().mockResolvedValue(undefined);

            await storageRepository.updateIngredientQuantity(ingredientId, quantity);

            expect(client.query).toHaveBeenCalledWith(
                'UPDATE storage SET quantity = quantity + $1 WHERE ingredient_id = $2;',
                [quantity, ingredientId]
            );
        });
    });

    describe('removeIngredientsFromStorage', () => {
        it('should remove ingredients based on the recipe ID', async () => {
            const recipeId = 2;

            client.query = jest.fn().mockResolvedValue(undefined);

            await storageRepository.removeIngredientsFromStorage(recipeId);

            expect(client.query).toHaveBeenCalledWith(
                expect.stringContaining(`UPDATE storage SET quantity = CASE WHEN storage.quantity - ri.quantity < 0 THEN 0 ELSE storage.quantity - ri.quantity END FROM recipe_ingredients ri WHERE ri.recipe_id = $1 AND storage.ingredient_id = ri.ingredient_id;`),
                [recipeId]
            );
        });
    });
});