import { PoolClient } from 'pg'

import { Order, OrderStatus } from '../../../../domain/entities/orders'
import { IOrderRepository } from '../../../../domain/repositories/orders'

export class OrderRepository implements IOrderRepository {
    private client: PoolClient

    constructor(client: PoolClient) {
        this.client = client
    }

    async listAll(): Promise<Order[]> {
        const res = await this.client.query(`
            SELECT 
                o.id AS orderId, 
                o.recipe_id AS recipeId, 
                o.status AS orderStatus, 
                o.created_at AS orderCreatedAt, 
                r.id AS recipeId, 
                r.name AS recipeName 
            FROM orders o 
            JOIN recipes r ON r.id = o.recipe_id
        `)
        return res.rows.map((row) => ({
            id: parseInt(row.orderid),
            recipe: { id: parseInt(row.recipeid), name: row.recipename },
            status: row.orderstatus,
            createdAt: row.ordercreatedat
        }))
    }

    async findById(id: number): Promise<Order | null> {
        const res = await this.client.query(
            `
            SELECT 
                o.id AS orderId, 
                o.recipe_id AS recipeId, 
                o.status AS orderStatus, 
                o.created_at AS orderCreatedAt, 
                r.id AS recipeId, 
                r.name AS recipeName 
            FROM orders o 
            JOIN recipes r ON r.id = o.recipe_id
            WHERE o.id = $1
            `,
            [id]
        )
        return {
            id: parseInt(res.rows[0].orderid),
            recipe: {
                id: parseInt(res.rows[0].recipeid),
                name: res.rows[0].recipename
            },
            status: res.rows[0].orderstatus,
            createdAt: res.rows[0].ordercreatedat
        }
    }

    async create(recipe_id: number, status: OrderStatus): Promise<Order> {
        const res1 = await this.client.query(
            'INSERT INTO orders (recipe_id, status) VALUES ($1, $2) RETURNING *',
            [recipe_id, status]
        )
        const res2 = await this.client.query(
            `
            SELECT 
                o.id AS orderId, 
                o.recipe_id AS recipeId, 
                o.status AS orderStatus, 
                o.created_at AS orderCreatedAt, 
                r.id AS recipeId, 
                r.name AS recipeName 
            FROM orders o 
            JOIN recipes r ON r.id = o.recipe_id
            WHERE o.id = $1
            `,
            [res1.rows[0].id]
        )
        return {
            id: parseInt(res2.rows[0].orderid),
            recipe: {
                id: parseInt(res2.rows[0].recipeid),
                name: res2.rows[0].recipename
            },
            status: res2.rows[0].orderstatus,
            createdAt: res2.rows[0].ordercreatedat
        }
    }

    async updateStatus(id: number, status: OrderStatus): Promise<Order> {
        const res1 = await this.client.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        )
        const res2 = await this.client.query(
            `
            SELECT 
                o.id AS orderId, 
                o.recipe_id AS recipeId, 
                o.status AS orderStatus, 
                o.created_at AS orderCreatedAt, 
                r.id AS recipeId, 
                r.name AS recipeName 
            FROM orders o 
            JOIN recipes r ON r.id = o.recipe_id
            WHERE o.id = $1
            `,
            [res1.rows[0].id]
        )
        return {
            id: parseInt(res2.rows[0].orderid),
            recipe: {
                id: parseInt(res2.rows[0].recipeid),
                name: res2.rows[0].recipename
            },
            status: res2.rows[0].orderstatus,
            createdAt: res2.rows[0].ordercreatedat
        }
    }
}
