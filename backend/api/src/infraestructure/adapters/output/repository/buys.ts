import { PoolClient } from 'pg'
import { IBuysRepository } from '../../../../domain/repositories/buys'
import { Buy } from '../../../../domain/entities/buys'

export class BuysRepository implements IBuysRepository {
    private client: PoolClient

    constructor(client: PoolClient) {
        this.client = client
    }

    async listAll(): Promise<Buy[]> {
        const res = await this.client.query(`
            SELECT 
                b.id as buyId, 
                b.quantity as buyQuantity, 
                i.id as ingredientId, 
                i.name as ingredientName 
            FROM buys b 
            JOIN ingredients i ON i.id = b.ingredient_id;
        `)
        return res.rows.map((row) => ({
            id: parseInt(row.buyid),
            ingredient: {
                id: parseInt(row.ingredientid),
                name: row.ingredientname as string
            },
            quantity: parseInt(row.buyquantity)
        }))
    }
}
