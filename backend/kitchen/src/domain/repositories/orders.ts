import { OrderStatus } from '../entities/orders'
import { Order } from '../entities/orders'

export class IOrderRepository {
    async findById(id: number): Promise<Order | null> {
        throw new Error('Method not implemented.')
    }

    async updateStatus(id: number, status: OrderStatus) {
        throw new Error('Method not implemented.')
    }
}
