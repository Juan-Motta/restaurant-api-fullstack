import { PoolClient } from 'pg'
import { KitchenService } from '../../application/services/kitchen'
import { getOrderRepository, getSorageRepository } from './repositories'

export async function getKitchenService(client: PoolClient) {
    const orderRepository = await getOrderRepository(client)
    const storageRepository = await getSorageRepository(client)
    return new KitchenService(orderRepository, storageRepository)
}