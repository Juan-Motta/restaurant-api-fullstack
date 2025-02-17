import { PoolClient } from 'pg'
import { IStorageRepository } from '../../../../domain/repositories/storages'
import { Ingredient } from '../../../../domain/entities/ingredients'

export class StorageRepository implements IStorageRepository {
    private client: PoolClient

    constructor(client: PoolClient) {
        this.client = client
    }

    async getAllIngredients(): Promise<Ingredient[]> {
        const res = await this.client.query(`
            SELECT 
                i.id as ingredientId, 
                i.name as ingredientName, 
                s.quantity as ingredientQuantity 
            FROM ingredients i 
            JOIN storage s ON s.ingredient_id = i.id;
        `)
        return res.rows.map((row) => ({
            id: row.ingredientid,
            name: row.ingredientname,
            quantity: row.ingredientquantity
        }))
    }
}
