import { PoolClient } from 'pg'
import { StorageService } from '../../application/services/storage'
import { getHttpAdapter, getRabbitMQProducer } from './utils'
import {
    getRecipeRepository,
    getOrderRepository,
    getEventsLogsRepository,
    getBuysRepository,
    getStorageRespository
} from './repositories'

export async function getStorageService(client: PoolClient) {
    const httpAdapter = await getHttpAdapter()
    const recipeRepository = await getRecipeRepository(client)
    const buysRepository = await getBuysRepository(client)
    const orderRepository = await getOrderRepository(client)
    const storageRepository = await getStorageRespository(client)
    const rabbitMQProducer = await getRabbitMQProducer()
    const eventsLogsRepository = await getEventsLogsRepository(client)
    return new StorageService(
        httpAdapter,
        recipeRepository,
        buysRepository,
        orderRepository,
        storageRepository,
        rabbitMQProducer,
        eventsLogsRepository
    )
}
