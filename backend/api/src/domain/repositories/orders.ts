import { OrderStatus } from '../entities/orders'
import { Order } from '../entities/orders'
import { OrderFilter } from '../filters/orders'

export class IOrderRepository {
    async create(recipe_id: number, status: OrderStatus): Promise<Order> {
        throw new Error('Method not implemented.')
    }

    async findById(id: number): Promise<Order | null> {
        throw new Error('Method not implemented.')
    }

    async countAll(): Promise<number> {
        throw new Error('Method not implemented.')
    }

    async listAll(filters: OrderFilter): Promise<Order[]> {
        throw new Error('Method not implemented.')
    }

    async updateStatus(id: number, status: OrderStatus): Promise<Order> {
        throw new Error('Method not implemented.')
    }

    async getOrdersResume(): Promise<{status: string, count: number, totalCount: number}[]> {
        throw new Error('Method not implemented.')
    }
}
