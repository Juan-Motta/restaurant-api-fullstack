import { PoolClient } from 'pg'
import { Recipe } from '../../../../domain/entities/recipes'

export class RecipeRepository {
    private client: PoolClient
    
    constructor(client: PoolClient) {
        this.client = client
    }

    async getRandomRecipe(): Promise<Recipe> {
        const res = await this.client.query(`
            SELECT * FROM recipes ORDER BY RANDOM() LIMIT 1
        `)
        return {
            id: parseInt(res.rows[0].id),
            name: res.rows[0].name,
        }
    }
}