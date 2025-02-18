import { StorageService } from '../../../src/application/services/storage';
import { IHttpAdapter } from '../../../src/domain/adapters/http';
import { IRecipeRepository } from '../../../src/domain/repositories/recipes';
import { IBuysRepository } from '../../../src/domain/repositories/buys';
import { IOrderRepository } from '../../../src/domain/repositories/orders';
import { IStorageRepository } from '../../../src/domain/repositories/storages';
import { IRabbitMQProducer } from '../../../src/domain/adapters/rabbitmq';
import { IEventsLogsRepository } from '../../../src/domain/repositories/eventsLogs';
import { MarketResponse } from '../../../src/domain/entities/market';
import { OrderStatus } from '../../../src/domain/entities/orders';
import Logger from '../../../src/infraestructure/config/logger';
import { Events } from '../../../src/domain/constants/events';
import { EventLogsState } from '../../../src/domain/constants/logsStates';

jest.mock('../../../src/infraestructure/config/logger');

describe('StorageService', () => {
    let storageService: StorageService;
    let httpAdapter: IHttpAdapter;
    let recipeRepository: IRecipeRepository;
    let buysRepository: IBuysRepository;
    let orderRepository: IOrderRepository;
    let storageRepository: IStorageRepository;
    let rabbitMQProducer: IRabbitMQProducer;
    let eventsLogsRepository: IEventsLogsRepository;

    beforeEach(() => {
        httpAdapter = {
            get: jest.fn(),
        } as unknown as IHttpAdapter;

        recipeRepository = {
            getRecipeIngredientsNeeded: jest.fn(),
        } as unknown as IRecipeRepository;

        buysRepository = {
            create: jest.fn(),
        } as unknown as IBuysRepository;

        orderRepository = {
            findById: jest.fn(),
            updateStatus: jest.fn(),
        } as unknown as IOrderRepository;

        storageRepository = {
            updateIngredientQuantity: jest.fn(),
            getAllIngredients: jest.fn(),
        } as unknown as IStorageRepository;

        rabbitMQProducer = {
            publish: jest.fn(),
        } as unknown as IRabbitMQProducer;

        eventsLogsRepository = {
            create: jest.fn(),
        } as unknown as IEventsLogsRepository;

        storageService = new StorageService(
            httpAdapter,
            recipeRepository,
            buysRepository,
            orderRepository,
            storageRepository,
            rabbitMQProducer,
            eventsLogsRepository
        );
    });

    describe('notifyToKitchen', () => {
        it('should notify the kitchen and log the event', async () => {
            const orderId = 1;
            const message = {
                event: 'PREPARE_ORDER',
                data: { orderId: orderId, orderStatus: OrderStatus.IN_KITCHEN },
            };

            rabbitMQProducer.publish = jest.fn().mockResolvedValue(undefined);
            eventsLogsRepository.create = jest.fn().mockResolvedValue(undefined);

            await storageService.notifyToKitchen(orderId);

            expect(rabbitMQProducer.publish).toHaveBeenCalledWith(
                expect.anything(),
                message
            );
            expect(eventsLogsRepository.create).toHaveBeenCalledWith(
                Events.PREPARE_ORDER,
                message,
                EventLogsState.CREATED,
                null
            );
        });

        it('should handle errors when notifying kitchen', async () => {
            const orderId = 1;
            const message = {
                event: 'PREPARE_ORDER',
                data: { orderId: orderId, orderStatus: OrderStatus.IN_KITCHEN },
            };

            rabbitMQProducer.publish = jest.fn().mockRejectedValue(new Error('RabbitMQ error'));
            eventsLogsRepository.create = jest.fn().mockResolvedValue(undefined);

            await storageService.notifyToKitchen(orderId);

            expect(eventsLogsRepository.create).toHaveBeenCalledWith(
                Events.PREPARE_ORDER,
                message,
                EventLogsState.CREATED_FAILED,
                expect.stringContaining('Error notifying to kitchen: Error: RabbitMQ error')
            );
        });
    });

    describe('prepareIngredients', () => {
        it('should prepare ingredients for the order', async () => {
            const mockOrder = { id: 1, recipe: { id: 2 } };
            orderRepository.findById = jest.fn().mockResolvedValue(mockOrder);
            recipeRepository.getRecipeIngredientsNeeded = jest.fn().mockResolvedValue([
                { ingredientId: 1, ingredientName: 'Flour', shortageQuantity: -5 },
            ]);

            const buyIngredientSpy = jest.spyOn(storageService, 'buyIngredient').mockResolvedValue(undefined);
            const notifyToKitchenSpy = jest.spyOn(storageService, 'notifyToKitchen').mockResolvedValue(undefined);
            const updateStatusSpy = jest.spyOn(orderRepository, 'updateStatus').mockResolvedValue(undefined);

            await storageService.prepareIngrtedients(1);
            
            expect(orderRepository.findById).toHaveBeenCalledWith(1);
            expect(recipeRepository.getRecipeIngredientsNeeded).toHaveBeenCalledWith(2);
            expect(buyIngredientSpy).toHaveBeenCalledWith(1, 'Flour', 5);
            expect(notifyToKitchenSpy).toHaveBeenCalledWith(1);
            expect(updateStatusSpy).toHaveBeenCalledWith(1, OrderStatus.IN_KITCHEN);
        });
    });

    describe('getAllIngredients', () => {
        it('should return all ingredients from storage', async () => {
            const mockIngredients = [{ id: 1, name: 'Sugar', quantity: 100 }];
            storageRepository.getAllIngredients = jest.fn().mockResolvedValue(mockIngredients);

            const result = await storageService.getAllIngredients();

            expect(result).toBe(mockIngredients);
            expect(storageRepository.getAllIngredients).toHaveBeenCalled();
        });
    });
});