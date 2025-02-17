import { Recipe, RecipeWithIngredients } from '../entities/recipes'
import { RecipeFilter } from '../filters/recipes'

export class IRecipeRepository {
    async getRandomRecipe(): Promise<Recipe> {
        throw new Error('Method not implemented.')
    }

    async countAll(): Promise<number> {
        throw new Error('Method not implemented.')
    }

    async getRecipeById(id: number): Promise<RecipeWithIngredients> {
        throw new Error('Method not implemented.')
    }

    async listAllRecipes(filters: RecipeFilter): Promise<Recipe[]> {
        throw new Error('Method not implemented.')
    }
}
