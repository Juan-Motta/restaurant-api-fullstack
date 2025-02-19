import { PoolClient } from 'pg'
import { IBuysRepository } from '../../../../domain/repositories/buys'
import { Buy } from '../../../../domain/entities/buys'
import { BuyFilter } from '../../../../domain/filters/buys'

export class BuysRepository implements IBuysRepository {
    private client: PoolClient

    constructor(client: PoolClient) {
        this.client = client
    }

    async countAll(): Promise<number> {
        const res = await this.client.query('SELECT COUNT(*) FROM buys')
        return parseInt(res.rows[0].count)
    }

    async listAll(filters: BuyFilter): Promise<Buy[]> {
        let query = `
            SELECT 
                b.id as buyId, 
                b.quantity as buyQuantity, 
                i.id as ingredientId, 
                i.name as ingredientName,
                b.created_at as buyCreatedAt
            FROM buys b 
            JOIN ingredients i ON i.id = b.ingredient_id
        `
        const conditions = []
        const params = []

        let paramIndex = 1

        if (filters.buyId) {
            conditions.push(`b.id = $${paramIndex++}`)
            params.push(filters.buyId)
        }

        if (filters.ingredientId) {
            conditions.push(`i.id = $${paramIndex++}`)
            params.push(filters.ingredientId)
        }

        if (filters.ingredientName) {
            conditions.push(`i.name ilike $${paramIndex++}`)
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
            id: parseInt(row.buyid),
            ingredient: {
                id: parseInt(row.ingredientid),
                name: row.ingredientname as string
            },
            quantity: parseInt(row.buyquantity),
            createdAt: row.buycreatedat
        }))
    }
}
