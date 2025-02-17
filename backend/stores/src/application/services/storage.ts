import { IHttpAdapter } from "../../domain/adapters/http";
import { settings } from "../../infraestructure/config/settings";
import { MarketResponse } from "../../domain/entities/market";
import { IRecipeRepository } from "../../domain/repositories/recipes";
import { IBuysRepository } from "../../domain/repositories/buys";
import { IOrderRepository } from "../../domain/repositories/orders";
import { IStorageRepository } from "../../domain/repositories/storages";
import { IRabbitMQProducer } from "../../domain/adapters/rabbitmq";
import { Queues } from "../../domain/constants/queues";
import { Events } from "../../domain/constants/events";
import { OrderStatus } from "../../domain/entities/orders";

export class StorageService {
    private httpAdapter: IHttpAdapter;
    private recipeRepository: IRecipeRepository;
    private buysRepository: IBuysRepository;
    private orderRepository: IOrderRepository;
    private storageRepository: IStorageRepository;
    private rabbitMQProducer: IRabbitMQProducer;

    constructor(httpAdapter: IHttpAdapter, recipeRepository: IRecipeRepository, buysRepository: IBuysRepository, orderRepository: IOrderRepository, storageRepository: IStorageRepository, rabbitMQProducer: IRabbitMQProducer) {
        this.httpAdapter = httpAdapter;
        this.recipeRepository = recipeRepository;
        this.buysRepository = buysRepository;
        this.orderRepository = orderRepository;
        this.storageRepository = storageRepository;
        this.rabbitMQProducer = rabbitMQProducer;
    }

    public async buyIngredient(ingredientId: number, ingredientName: string, quantityNeeded: number) {
        const ingredientsBought = await this.getIngredientsFromMarket(ingredientName);
        await this.buysRepository.create(ingredientId, ingredientsBought.quantity);
        await this.storageRepository.updateIngredientQuantity(ingredientId, ingredientsBought.quantity);
        const requiredQuantity = quantityNeeded - ingredientsBought.quantity;
        if (requiredQuantity > 0) {
            await this.buyIngredient(ingredientId, ingredientName, requiredQuantity);
        }
    }

    public async getIngredientsFromMarket(ingredient: string): Promise<{name: string, quantity: number}> {
        const storeUrl = `${settings.MARKET_URL}/buy?ingredient=${ingredient}`;
        const data = await this.httpAdapter.get<MarketResponse>(storeUrl);
        if (!data) {
            return {name: ingredient, quantity: 0};
        }
        return {
            name: ingredient,
            quantity: data.quantitySold
        }
    }

    public async getRecipeIngredientsNeeded(recipeId: number) {
        return this.recipeRepository.getRecipeIngredientsNeeded(recipeId);
        
    }

    public async notifyToKitchen(orderId: number) {
        await this.rabbitMQProducer.publish(Queues.KITCHEN_QUEUE, {id: orderId, status: OrderStatus.IN_KITCHEN, event: Events.PREPARE_ORDER});
    }

    public async prepareIngrtedients(orderId: number) {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            return;
        }
        const ingredientsNeeded = await this.getRecipeIngredientsNeeded(order.recipe.id as number);
        for (const ingredient of ingredientsNeeded) {
            await this.buyIngredient(ingredient.ingredientId, ingredient.ingredientName, Math.abs(ingredient.shortageQuantity));
        }
        await this.notifyToKitchen(order.id as number);
        await this.orderRepository.updateStatus(orderId, OrderStatus.IN_KITCHEN);
        await this.storageRepository.removeIngredientsFromStorage(order.recipe.id as number);
    }

    public async getAllIngredients() {
        return this.storageRepository.getAllIngredients();
    }
}