import { PoolClient } from 'pg'
import { AuthService } from '../../application/services/auth'
import { JwtManager } from '../utils/jwt'
import { HttpAdapter } from '../adapters/output/http/request'
import { RecipeRepository } from '../adapters/output/repository/recipes'
import { BuysRepository } from '../adapters/output/repository/buys'
import { OrderRepository } from '../adapters/output/repository/orders'
import { StorageRepository } from '../adapters/output/repository/storages'
import { RabbitMQProducer } from '../adapters/output/rabbitmq/producer'
import { StorageService } from '../../application/services/storage'


export async function getStorageService(client: PoolClient) {
    const httpAdapter = new HttpAdapter()
    const recipeRepository = new RecipeRepository(client)
    const buysRepository = new BuysRepository(client)
    const orderRepository = new OrderRepository(client)
    const storageRepository = new StorageRepository(client)
    const rabbitMQProducer = new RabbitMQProducer()
    return new StorageService(httpAdapter, recipeRepository, buysRepository, orderRepository, storageRepository, rabbitMQProducer)
}


export async function getAuthService(req: any) {
    const jwtManager = new JwtManager()
    return new AuthService(jwtManager)
}