import { PoolClient } from 'pg'
import { IBuysRepository } from '../../../../domain/repositories/buys'

export class BuysRepository implements IBuysRepository {
    private client: PoolClient

    constructor(client: PoolClient) {
        this.client = client
    }

    async create(ingredientId: number, quantity: number): Promise<void> {
        await this.client.query(
            'INSERT INTO buys (ingredient_id, quantity) VALUES ($1, $2);',
            [ingredientId, quantity]
        )
    }
}