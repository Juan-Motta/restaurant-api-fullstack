import { IOrderRepository } from "../../domain/repositories/orders";
import { IStorageRepository } from "../../domain/repositories/storages";
import { OrderStatus } from "../../domain/entities/orders";
import Logger from "../../infraestructure/config/logger";

export class KitchenService {
    private orderRepository: IOrderRepository;
    private storageRepository: IStorageRepository;

    constructor(orderRepository: IOrderRepository, storageRepository: IStorageRepository) {
        this.orderRepository = orderRepository;
        this.storageRepository = storageRepository;
    }

    public async prepareOrder(orderId: number): Promise<void> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            Logger.info(`Order ${orderId} not found`);
            return;
        }
        Logger.info(`Removing ingredients from storage for order ${orderId}`);
        await this.storageRepository.removeIngredientsFromStorage(order.recipe.id as number);
        Logger.info(`Order ${orderId} prepared`);
        await this.orderRepository.updateStatus(orderId, OrderStatus.FINISHED);
    }
}