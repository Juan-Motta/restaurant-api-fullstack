import { OrderStatus } from "../entities/orders"
import { Order } from "../entities/orders"

export class IOrderRepository {
    async create(recipe_id: number, status: OrderStatus): Promise<Order> {
        throw new Error('Method not implemented.')
    }

    async findById(id: number): Promise<Order | null> {
        throw new Error('Method not implemented.')
    }

    async listAll(): Promise<Order[]> {
        throw new Error('Method not implemented.')
    }

    async updateStatus(id: number, status: OrderStatus): Promise<Order> {
        throw new Error('Method not implemented.')
    }
}