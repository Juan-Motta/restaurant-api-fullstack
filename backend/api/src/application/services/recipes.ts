import { RecipeRepository } from '../../infraestructure/adapters/output/repository/recipes'
import { IRecipeRepository } from '../../domain/repositories/recipes'

export class RecipesService {
    private recipeRepository: IRecipeRepository

    constructor(recipeRepository: IRecipeRepository) {
        this.recipeRepository = recipeRepository
    }

    public getRecipeById(id: number) {
        return this.recipeRepository.getRecipeById(id)
    }

    public listAllRecipes() {
        return this.recipeRepository.listAllRecipes()
    }
}
