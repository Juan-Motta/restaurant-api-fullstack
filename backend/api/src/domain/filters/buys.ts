import { ApiError } from '../exceptions/custom'

export interface BuyFilter {
    page: number
    perPage: number
    buyId?: number | null
    ingredientId?: number | null
    ingredientName?: string | null
}

export class BuyFilterValidator {
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

    static validateBuyId(buyId: string) {
        if (isNaN(Number(buyId))) {
            throw new ApiError('buyId must be a number', 400)
        }
    }

    static validateIngredientId(ingredientId: string) {
        if (isNaN(Number(ingredientId))) {
            throw new ApiError('ingredientId must be a number', 400)
        }
    }

    static validateIngredientName(ingredientName: string) {
        if (ingredientName === '') {
            throw new ApiError('ingredientName must not be empty', 400)
        }
    }

    static validate(query: any) {
        let filters = {
            page: 1,
            perPage: 10,
            buyId: null,
            ingredientId: null,
            ingredientName: null
        } as BuyFilter
        if (query.page) {
            this.validatePage(query.page)
            filters.page = parseInt(query.page)
        }
        if (query.perPage) {
            this.validatePerPage(query.perPage)
            filters.perPage = parseInt(query.perPage)
        }
        if (query.buyId) {
            this.validateBuyId(query.buyId)
            filters.buyId = parseInt(query.buyId)
        }
        if (query.ingredientId) {
            this.validateIngredientId(query.ingredientId)
            filters.ingredientId = parseInt(query.ingredientId)
        }
        if (query.ingredientName) {
            this.validateIngredientName(query.ingredientName)
            filters.ingredientName = query.ingredientName
        }
        return filters
    }
}
