import { RecipesService } from '../../../src/application/services/recipes';
import { IRecipeRepository } from '../../../src/domain/repositories/recipes';
import { RecipeFilter } from '../../../src/domain/filters/recipes';
import { Recipe } from '../../../src/domain/entities/recipes';

describe('RecipesService', () => {
    let recipesService: RecipesService;
    let recipeRepository: IRecipeRepository;

    beforeEach(() => {
        recipeRepository = {
            getRecipeById: jest.fn(),
            listAllRecipes: jest.fn(),
            countAll: jest.fn(),
        } as unknown as IRecipeRepository;

        recipesService = new RecipesService(recipeRepository);
    });

    describe('getRecipeById', () => {
        it('should return recipe by ID', async () => {
            const recipeId = 1;
            const mockRecipe = { id: recipeId, name: 'Test Recipe' };

            recipeRepository.getRecipeById = jest.fn().mockResolvedValue(mockRecipe);

            const result = await recipesService.getRecipeById(recipeId);

            expect(result).toEqual(mockRecipe);
            expect(recipeRepository.getRecipeById).toHaveBeenCalledWith(recipeId);
        });

        it('should return null if no recipe is found', async () => {
            const recipeId = 99;

            recipeRepository.getRecipeById = jest.fn().mockResolvedValue(null);

            const result = await recipesService.getRecipeById(recipeId);

            expect(result).toBeNull();
            expect(recipeRepository.getRecipeById).toHaveBeenCalledWith(recipeId);
        });
    });

    describe('listAllRecipes', () => {
        it('should return all recipes with pagination info', async () => {
            const filters: RecipeFilter = { page: 1, perPage: 10 };
            const mockData = [{ id: 1, name: 'Recipe 1' }, { id: 2, name: 'Recipe 2' }];
            const totalCount = 2;

            recipeRepository.listAllRecipes = jest.fn().mockResolvedValue(mockData);
            recipeRepository.countAll = jest.fn().mockResolvedValue(totalCount);

            const result = await recipesService.listAllRecipes(filters);

            expect(result).toEqual({ data: mockData, page: filters.page, perPage: filters.perPage, total: totalCount });
            expect(recipeRepository.listAllRecipes).toHaveBeenCalledWith(filters);
            expect(recipeRepository.countAll).toHaveBeenCalled();
        });

        it('should handle empty results', async () => {
            const filters: RecipeFilter = { page: 1, perPage: 10 };
            const mockData: Recipe[] = [];
            const totalCount = 0;

            recipeRepository.listAllRecipes = jest.fn().mockResolvedValue(mockData);
            recipeRepository.countAll = jest.fn().mockResolvedValue(totalCount);

            const result = await recipesService.listAllRecipes(filters);

            expect(result).toEqual({ data: mockData, page: filters.page, perPage: filters.perPage, total: totalCount });
            expect(recipeRepository.listAllRecipes).toHaveBeenCalledWith(filters);
            expect(recipeRepository.countAll).toHaveBeenCalled();
        });
    });
});