import { IOrderRepository } from '../../domain/repositories/orders'
import { IRecipeRepository } from '../../domain/repositories/recipes'
import { OrderStatus } from '../../domain/entities/orders'
import { IRabbitMQProducer } from '../../domain/adapters/rabbitmq'
import { Events } from '../../domain/constants/events'
import { Queues } from '../../domain/constants/queues'
import Logger from '../../infraestructure/config/logger'

export class OrdersService {
    private orderRepository: IOrderRepository
    private recipeRepository: IRecipeRepository
    private rabbitmqProducer: IRabbitMQProducer

    constructor(
        orderRepository: IOrderRepository,
        recipeRepository: IRecipeRepository,
        rabbitmqProducer: IRabbitMQProducer
    ) {
        this.orderRepository = orderRepository
        this.recipeRepository = recipeRepository
        this.rabbitmqProducer = rabbitmqProducer
    }

    public async createOrder() {
        const randomRecipe = await this.recipeRepository.getRandomRecipe()
        const createdOrder = await this.orderRepository.create(
            randomRecipe.id as number,
            OrderStatus.PREPARING
        )
        await this.sendCreateOrderEvent(
            createdOrder.id as number,
            OrderStatus.PREPARING
        )
        return createdOrder
    }

    public listAllOrders() {
        return this.orderRepository.listAll()
    }

    public async sendCreateOrderEvent(
        orderId: number,
        orderStatus: OrderStatus
    ) {
        try {
            await this.rabbitmqProducer.publish(Queues.STORE_QUEUE, {
                event: Events.CREATE_ORDER,
                data: { orderId, orderStatus }
            })
        } catch (error) {
            Logger.error(`Error sending create order event: ${error}`)
        }
    }

    public async getOrderById(orderId: number) {
        return this.orderRepository.findById(orderId)
    }
}
