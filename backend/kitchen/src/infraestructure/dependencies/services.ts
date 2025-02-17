import { PoolClient } from 'pg'
import { OrderRepository } from '../adapters/output/repository/orders'
import { StorageRepository } from '../adapters/output/repository/storages'
import { KitchenService } from '../../application/services/kitchen'

export async function getKitchenService(client: PoolClient) {
    const orderRepository = new OrderRepository(client)
    const storageRepository = new StorageRepository(client)
    return new KitchenService(orderRepository, storageRepository)
}