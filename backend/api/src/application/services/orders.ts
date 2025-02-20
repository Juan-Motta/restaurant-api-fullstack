import { IOrderRepository } from '../../domain/repositories/orders'
import { IRecipeRepository } from '../../domain/repositories/recipes'
import { OrderStatus } from '../../domain/entities/orders'
import { IRabbitMQProducer } from '../../domain/adapters/rabbitmq'
import { Events } from '../../domain/constants/events'
import { Queues } from '../../domain/constants/queues'
import Logger from '../../infraestructure/config/logger'
import { IEventsLogsRepository } from '../../domain/repositories/eventsLogs'
import { EventLogsState } from '../../domain/constants/logsStates'
import { OrderFilter } from '../../domain/filters/orders'

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

    public async listAllOrders(filters: OrderFilter) {
        const data = await this.orderRepository.listAll(filters)
        const total = await this.orderRepository.countAll()
        return { data, page: filters.page, perPage: filters.perPage, total }
    }

    public async sendCreateOrderEvent(
        orderId: number,
        orderStatus: OrderStatus
    ) {
        const message = {
            event: Events.CREATE_ORDER,
            data: { orderId, orderStatus }
        }
        try {
            await this.rabbitmqProducer.publish(Queues.STORE_QUEUE, message)
            await this.eventsLogsRepository.create(
                Events.CREATE_ORDER,
                message,
                EventLogsState.CREATED,
                null
            )
        } catch (error) {
            const errorMessage = `Error sending create order event: ${error}`
            Logger.error(errorMessage)
            await this.eventsLogsRepository.create(
                Events.CREATE_ORDER,
                message,
                EventLogsState.CREATED_FAILED,
                errorMessage
            )
        }
    }

    public async getOrderById(orderId: number) {
        return this.orderRepository.findById(orderId)
    }

    public async getOrdersResume() {
        return this.orderRepository.getOrdersResume()
    }
}
