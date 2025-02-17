import { AuthService } from '../../application/services/auth'
import { UserService } from '../../application/services/user'
import { PoolClient } from 'pg'
import { OrdersService } from '../../application/services/orders'
import { StorageService } from '../../application/services/storage'
import { BuysService } from '../../application/services/buys'
import { getJwtManager, getPasswordManager, getRabbitMQProducer } from './utils'
import { RecipesService } from '../../application/services/recipes'

import {
    getUserRepository,
    getBuysRepository,
    getOrderRepository,
    getRecipeRepository,
    getStorageRespository,
    getEventsLogsRepository
} from './repositories'

export async function getUserService(client: PoolClient) {
    const userRepository = await getUserRepository(client)
    const passwordManager = await getPasswordManager()
    return new UserService(userRepository, passwordManager)
}

export async function getAuthService(client: PoolClient) {
    const userRepository = await getUserRepository(client)
    const passwordManager = await getPasswordManager()
    const jwtManager = await getJwtManager()
    return new AuthService(userRepository, passwordManager, jwtManager)
}

export async function getOrderService(client: PoolClient) {
    const orderRepository = await getOrderRepository(client)
    const recipeRepository = await getRecipeRepository(client)
    const rabbitmqProducer = await getRabbitMQProducer()
    const eventsLogsRepository = await getEventsLogsRepository(client)
    return new OrdersService(
        orderRepository,
        recipeRepository,
        rabbitmqProducer,
        eventsLogsRepository
    )
}

export async function getStorageService(client: PoolClient) {
    const storageRepository = await getStorageRespository(client)
    return new StorageService(storageRepository)
}

export async function getBuysService(client: PoolClient) {
    const buysRepository = await getBuysRepository(client)
    return new BuysService(buysRepository)
}

export async function getRecipesService(client: PoolClient) {
    const recipeRepository = await getRecipeRepository(client)
    return new RecipesService(recipeRepository)
}
