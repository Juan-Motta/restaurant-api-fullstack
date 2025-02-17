import { Recipe } from "../entities/recipes"
import { RecipeIngredientNeeded } from "../entities/recipes"

export class IRecipeRepository {
    async getRecipeIngredientsNeeded(recipe_id: number): Promise<RecipeIngredientNeeded[]> {
        throw new Error('Method not implemented.')
    }
}