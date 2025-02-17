import { Ingredient } from '../entities/ingredients'

export class IStorageRepository {
    async getAllIngredients(): Promise<Ingredient[]> {
        throw new Error('Method not implemented.')
    }
}
