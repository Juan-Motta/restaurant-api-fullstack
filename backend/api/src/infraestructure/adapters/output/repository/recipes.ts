import { PoolClient } from 'pg'
import {
    Recipe,
    RecipeWithIngredients
} from '../../../../domain/entities/recipes'
import { IRecipeRepository } from '../../../../domain/repositories/recipes'
import { RecipeFilter } from '../../../../domain/filters/recipes'

export class RecipeRepository implements IRecipeRepository {
    private client: PoolClient

    constructor(client: PoolClient) {
        this.client = client
    }

    async countAll(): Promise<number> {
        const res = await this.client.query('SELECT COUNT(*) FROM recipes')
        return parseInt(res.rows[0].count)
    }

    async getRandomRecipe(): Promise<Recipe> {
        const res = await this.client.query(
            `SELECT * FROM recipes ORDER BY RANDOM() LIMIT 1`
        )
        return {
            id: parseInt(res.rows[0].id),
            name: res.rows[0].name
        }
    }

    async getRecipeById(id: number): Promise<RecipeWithIngredients | null> {
        const res = await this.client.query(
            `
            SELECT 
                r.id as recipeId, 
                r.name as recipeName,
                r.image_url as recipeImageUrl, 
                i.id as ingredientId, 
                i.name as ingredientName, 
                ri.quantity as ingredientQuantity,
                i.image_url as ingredientImageUrl
            FROM recipes r 
            JOIN recipe_ingredients ri ON r.id = ri.recipe_id 
            JOIN ingredients i ON ri.ingredient_id = i.id 
            WHERE r.id = $1
        `,
            [id]
        )
        if (res.rows.length === 0) {
            return null
        }
        const recipeIngredients = res.rows.map((row: any) => ({
            id: parseInt(row.ingredientid),
            name: row.ingredientname,
            quantity: row.ingredientquantity,
            imageUrl: row.ingredientimageurl
        }))
        return {
            id: parseInt(res.rows[0].recipeid),
            name: res.rows[0].recipename,
            imageUrl: res.rows[0].recipeimageurl,
            ingredients: recipeIngredients
        }
    }

    async listAllRecipes(
        filters: RecipeFilter
    ): Promise<RecipeWithIngredients[]> {
        let query = `
            SELECT
                r.id AS recipeId,
                r.name AS recipeName,
                r.image_url AS recipeImageUrl,
                json_agg(json_build_object('id', i.id, 'name', i.name, 'quantity', ri.quantity, 'image_url', i.image_url)) AS ingredients
            FROM
                recipes r
            JOIN
                recipe_ingredients ri ON r.id = ri.recipe_id
            JOIN
                ingredients i ON ri.ingredient_id = i.id
        `
        const conditions = []
        const params = []

        let paramIndex = 1

        if (filters.recipeId) {
            conditions.push(`r.id = $${paramIndex++}`)
            params.push(filters.recipeId)
        }

        if (filters.recipeName) {
            conditions.push(`r.name = $${paramIndex++}`)
            params.push(filters.recipeName)
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ')
        }

        const page = filters.page
        const perPage = filters.perPage
        const offset = (page - 1) * perPage

        query += ` GROUP BY r.id, r.name`
        query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`

        params.push(perPage, offset)

        const res = await this.client.query(query, params)

        return res.rows.map(
            (row: {
                recipeid: string
                recipename: string
                recipeimageurl: string
                ingredients: { id: number; name: string; quantity: number }[]
            }) => ({
                id: parseInt(row.recipeid),
                name: row.recipename,
                imageUrl: row.recipeimageurl,
                ingredients: row.ingredients
            })
        )
    }
}
