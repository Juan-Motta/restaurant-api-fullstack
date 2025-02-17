import { IRecipeRepository } from '../../domain/repositories/recipes'
import { RecipeFilter } from '../../domain/filters/recipes'

export class RecipesService {
    private recipeRepository: IRecipeRepository

    constructor(recipeRepository: IRecipeRepository) {
        this.recipeRepository = recipeRepository
    }

    public async getRecipeById(id: number) {
        return this.recipeRepository.getRecipeById(id)
    }

    public async listAllRecipes(filters: RecipeFilter) {
        const data = await this.recipeRepository.listAllRecipes(filters)
        const total = await this.recipeRepository.countAll()
        return { data, page: filters.page, perPage: filters.perPage, total }
    }
}
