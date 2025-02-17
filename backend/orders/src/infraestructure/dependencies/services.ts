import { PoolClient } from 'pg'
import { OrderRepository } from '../adapters/output/repository/orders'
import { RecipeRepository } from '../adapters/output/repository/recipes'
import { OrdersService } from '../../application/services/orders'
import { AuthService } from '../../application/services/auth'
import { JwtManager } from '../utils/jwt'
import { RabbitMQProducer } from '../adapters/output/rabbitmq/producer'

export async function getOrderService(client: PoolClient) {
    const orderRepository = new OrderRepository(client)
    const recipeRepository = new RecipeRepository(client)
    const rabbitmqProducer = new RabbitMQProducer()
    return new OrdersService(orderRepository, recipeRepository, rabbitmqProducer)
}

export async function getAuthService(req: any) {
    const jwtManager = new JwtManager()
    return new AuthService(jwtManager)
}