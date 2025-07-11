import { PoolClient } from 'pg'
import { IStorageRepository } from '../../../../domain/repositories/storages'
import { Ingredient } from '../../../../domain/entities/ingredients'

export class StorageRepository implements IStorageRepository {
    private client: PoolClient

    constructor(client: PoolClient) {
        this.client = client
    }

    async getAllIngredients(): Promise<Ingredient[]> {
        const res = await this.client.query('SELECT * FROM ingredients;')
        return res.rows.map((row) => ({
            id: row.id,
            name: row.name
        }))
    }

    async updateIngredientQuantity(
        ingredientId: number,
        quantity: number
    ): Promise<void> {
        await this.client.query(
            'UPDATE storage SET quantity = quantity + $1 WHERE ingredient_id = $2;',
            [quantity, ingredientId]
        )
    }

    async removeIngredientsFromStorage(recipeId: number): Promise<void> {
        await this.client.query(
            `
            UPDATE storage
            SET quantity = CASE
                WHEN storage.quantity - ri.quantity < 0 THEN 0
                ELSE storage.quantity - ri.quantity
            END
            FROM recipe_ingredients ri
            WHERE
                ri.recipe_id = $1
                AND storage.ingredient_id = ri.ingredient_id;
            `,
            [recipeId]
        )
    }
}
