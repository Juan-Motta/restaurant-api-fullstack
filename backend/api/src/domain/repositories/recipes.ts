import { Recipe, RecipeWithIngredients } from '../entities/recipes'

export class IRecipeRepository {
    async getRandomRecipe(): Promise<Recipe> {
        throw new Error('Method not implemented.')
    }

    async getRecipeById(id: number): Promise<RecipeWithIngredients> {
        throw new Error('Method not implemented.')
    }

    async listAllRecipes(): Promise<Recipe[]> {
        throw new Error('Method not implemented.')
    }
}
