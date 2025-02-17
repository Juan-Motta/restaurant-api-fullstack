export class IStorageRepository {
    async updateIngredientQuantity(
        ingredientId: number,
        quantity: number
    ): Promise<void> {
        throw new Error('Method not implemented.')
    }

    async removeIngredientsFromStorage(recipeId: number): Promise<void> {
        throw new Error('Method not implemented.')
    }
}
