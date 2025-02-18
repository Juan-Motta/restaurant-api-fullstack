import { PoolClient } from 'pg';
import { RecipeRepository } from '../../../../../src/infraestructure/adapters/output/repository/recipes';
import { RecipeIngredientNeeded } from '../../../../../src/domain/entities/recipes';

describe('RecipeRepository', () => {
    let client: PoolClient;
    let recipeRepository: RecipeRepository;

    beforeEach(() => {
        client = {
            query: jest.fn(),
        } as unknown as PoolClient;
        recipeRepository = new RecipeRepository(client);
    });

    describe('getRecipeIngredientsNeeded', () => {
        it('should return the ingredients needed for a recipe', async () => {
            const recipeId = 1;
            const mockQueryResult = {
                rows: [
                    {
                        ingredientId: '1',
                        ingredientName: 'Flour',
                        requiredQuantity: 500,
                        availableQuantity: 300,
                        shortageQuantity: -200,
                    },
                    {
                        ingredientId: '2',
                        ingredientName: 'Water',
                        requiredQuantity: 200,
                        availableQuantity: 250,
                        shortageQuantity: 0,
                    },
                ],
            };

            client.query = jest.fn().mockResolvedValue(mockQueryResult);

            const result: RecipeIngredientNeeded[] = await recipeRepository.getRecipeIngredientsNeeded(recipeId);
        });

        it('should return an empty array if no ingredients are needed', async () => {
            const recipeId = 1;
            const mockQueryResult = { rows: [] };

            client.query = jest.fn().mockResolvedValue(mockQueryResult);

            const result: RecipeIngredientNeeded[] = await recipeRepository.getRecipeIngredientsNeeded(recipeId);

            expect(result).toEqual([]);
        });
    });
});