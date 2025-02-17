import { PoolClient } from 'pg'
import { IStorageRepository } from '../../../../domain/repositories/storages'
import { Ingredient } from '../../../../domain/entities/ingredients'
import { IngredientFilter } from '../../../../domain/filters/ingredients'

export class StorageRepository implements IStorageRepository {
    private client: PoolClient

    constructor(client: PoolClient) {
        this.client = client
    }

    async countAll(): Promise<number> {
        const res = await this.client.query('SELECT COUNT(*) FROM ingredients')
        return parseInt(res.rows[0].count)
    }

    async getAllIngredients(filters: IngredientFilter): Promise<Ingredient[]> {
        let query = `
            SELECT 
                i.id as ingredientId, 
                i.name as ingredientName, 
                s.quantity as ingredientQuantity 
            FROM ingredients i 
            JOIN storage s ON s.ingredient_id = i.id
        `
        const conditions = []
        const params = []

        let paramIndex = 1

        if (filters.ingredientId) {
            conditions.push(`i.id = $${paramIndex++}`)
            params.push(filters.ingredientId)
        }

        if (filters.ingredientName) {
            conditions.push(`i.name ILIKE $${paramIndex++}`)
            params.push(`%${filters.ingredientName}%`)
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ')
        }

        const page = filters.page
        const perPage = filters.perPage
        const offset = (page - 1) * perPage

        query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`

        params.push(perPage, offset)
        const res = await this.client.query(query, params)
        return res.rows.map((row) => ({
            id: row.ingredientid,
            name: row.ingredientname,
            quantity: row.ingredientquantity
        }))
    }
}
