import { PoolClient } from 'pg'
import { RecipeIngredientNeeded } from '../../../../domain/entities/recipes'
import { IRecipeRepository } from '../../../../domain/repositories/recipes'

export class RecipeRepository implements IRecipeRepository {
    private client: PoolClient
    
    constructor(client: PoolClient) {
        this.client = client
    }

    async getRecipeIngredientsNeeded(recipe_id: number): Promise<RecipeIngredientNeeded[]> {
        const res = await this.client.query(`
            SELECT
                ri.ingredient_id AS ingredientId,
                i.name AS ingredientName,
                ri.quantity AS requiredQuantity,
                COALESCE(s.quantity, 0) AS availableQuantity,
                COALESCE(s.quantity, 0) - ri.quantity AS shortageQuantity
            FROM
                recipe_ingredients ri
            JOIN
                ingredients i ON i.id = ri.ingredient_id
            LEFT JOIN
                storage s ON s.ingredient_id = ri.ingredient_id
            WHERE
                ri.recipe_id = $1
                AND COALESCE(s.quantity, 0) - ri.quantity < 0;
        `,
        [recipe_id]
        )
        return res.rows.map((row) => ({
                ingredientId: parseInt(res.rows[0].ingredientid),
                ingredientName: res.rows[0].ingredientname,
                requiredQuantity: res.rows[0].requiredquantity,
                availableQuantity: res.rows[0].availablequantity,
                shortageQuantity: res.rows[0].shortagequantity
            })
        )
    }
}