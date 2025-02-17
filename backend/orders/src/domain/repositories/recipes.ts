import { Recipe } from "../entities/recipes"

export class IRecipeRepository {
    async getRandomRecipe(): Promise<Recipe> {
        throw new Error('Method not implemented.')
    }
}