import { IOrderRepository } from '../../domain/repositories/orders'
import { IRecipeRepository } from '../../domain/repositories/recipes'
import { OrderStatus } from '../../domain/entities/orders'
import { IRabbitMQProducer } from '../../domain/adapters/rabbitmq'
import { Events } from '../../domain/constants/events'
import { Queues } from '../../domain/constants/queues'
import Logger from '../../infraestructure/config/logger'
import { IEventsLogsRepository } from '../../domain/repositories/eventsLogs'
import { EventLogsState } from '../../domain/constants/logsStates'

export class OrdersService {
    private orderRepository: IOrderRepository
    private recipeRepository: IRecipeRepository
    private rabbitmqProducer: IRabbitMQProducer
    private eventsLogsRepository: IEventsLogsRepository

    constructor(
        orderRepository: IOrderRepository,
        recipeRepository: IRecipeRepository,
        rabbitmqProducer: IRabbitMQProducer,
        eventsLogsRepository: IEventsLogsRepository
    ) {
        this.orderRepository = orderRepository
        this.recipeRepository = recipeRepository
        this.rabbitmqProducer = rabbitmqProducer
        this.eventsLogsRepository = eventsLogsRepository
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
            await this.eventsLogsRepository.create(
                Events.CREATE_ORDER,
                {
                    event: Events.CREATE_ORDER,
                    data: { orderId, orderStatus }
                },
                EventLogsState.CREATED,
                null
            )
        } catch (error) {
            Logger.error(`Error sending create order event: ${error}`)
            await this.eventsLogsRepository.create(
                Events.CREATE_ORDER,
                {
                    event: Events.CREATE_ORDER,
                    data: { orderId, orderStatus }
                },
                EventLogsState.CREATED_FAILED,
                `Error sending create order event: ${error}`
            )
        }
    }

    public async getOrderById(orderId: number) {
        return this.orderRepository.findById(orderId)
    }
}
