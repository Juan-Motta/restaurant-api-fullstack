import { PoolClient } from 'pg'
import {
    Recipe,
    RecipeWithIngredients
} from '../../../../domain/entities/recipes'
import { IRecipeRepository } from '../../../../domain/repositories/recipes'

export class RecipeRepository implements IRecipeRepository {
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
            name: res.rows[0].name
        }
    }

    async getRecipeById(id: number): Promise<RecipeWithIngredients> {
        const res = await this.client.query(
            `
            SELECT 
                r.id as recipeId, 
                r.name as recipeName, 
                i.id as ingredientId, 
                i.name as ingredientName, 
                ri.quantity as ingredientQuantity 
            FROM recipes r 
            JOIN recipe_ingredients ri ON r.id = ri.recipe_id 
            JOIN ingredients i ON ri.ingredient_id = i.id 
            WHERE r.id = $1
        `,
            [id]
        )
        const recipeIngredients = res.rows.map((row: any) => ({
            id: parseInt(row.ingredientid),
            name: row.ingredientname,
            quantity: row.ingredientquantity
        }))
        return {
            id: parseInt(res.rows[0].recipeid),
            name: res.rows[0].recipename,
            ingredients: recipeIngredients
        }
    }

    async listAllRecipes(): Promise<Recipe[]> {
        const res = await this.client.query(`
            SELECT * FROM recipes
        `)
        return res.rows.map((row: any) => ({
            id: parseInt(row.id),
            name: row.name
        }))
    }
}
