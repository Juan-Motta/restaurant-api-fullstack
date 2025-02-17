import { ApiError } from '../exceptions/custom'

export interface RecipeFilter {
    page: number
    perPage: number
    recipeId?: number | null
    recipeName?: string | null
}

export class RecipeFilterValidator {
    static validatePage(page: string) {
        if (isNaN(Number(page))) {
            throw new ApiError('Page must be a number', 400)
        }
    }

    static validatePerPage(perPage: string) {
        if (isNaN(Number(perPage))) {
            throw new ApiError('PerPage must be a number', 400)
        }
    }

    static validateRecipeId(recipeId: string) {
        if (isNaN(Number(recipeId))) {
            throw new ApiError('RecipeId must be a number', 400)
        }
    }

    static validateRecipeName(recipeName: string) {
        if (recipeName === '') {
            throw new ApiError('RecipeName must not be empty', 400)
        }
    }

    static validate(query: any) {
        let filters = {
            page: 1,
            perPage: 10,
            orderId: null,
            orderStatus: null
        } as RecipeFilter
        if (query.page) {
            this.validatePage(query.page)
            filters.page = parseInt(query.page)
        }
        if (query.perPage) {
            this.validatePerPage(query.perPage)
            filters.perPage = parseInt(query.perPage)
        }
        if (query.recipeId) {
            this.validateRecipeId(query.recipeId)
            filters.recipeId = parseInt(query.recipeId)
        }
        if (query.recipeName) {
            this.validateRecipeName(query.recipeName)
            filters.recipeName = query.recipeName
        }
        return filters
    }
}
