import { Ingredient } from '../entities/ingredients'
import { IngredientFilter } from '../filters/ingredients'

export class IStorageRepository {
    async countAll(): Promise<number> {
        throw new Error('Method not implemented.')
    }

    async getAllIngredients(filters: IngredientFilter): Promise<Ingredient[]> {
        throw new Error('Method not implemented.')
    }
}
