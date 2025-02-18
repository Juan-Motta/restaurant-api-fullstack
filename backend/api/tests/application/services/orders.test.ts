import { OrdersService } from '../../../src/application/services/orders';
import { IOrderRepository } from '../../../src/domain/repositories/orders';
import { IRecipeRepository } from '../../../src/domain/repositories/recipes';
import { IRabbitMQProducer } from '../../../src/domain/adapters/rabbitmq';
import { IEventsLogsRepository } from '../../../src/domain/repositories/eventsLogs';
import { OrderStatus } from '../../../src/domain/entities/orders';
import { Events } from '../../../src/domain/constants/events';
import { EventLogsState } from '../../../src/domain/constants/logsStates';
import { OrderFilter } from '../../../src/domain/filters/orders';

describe('OrdersService', () => {
    let ordersService: OrdersService;
    let orderRepository: IOrderRepository;
    let recipeRepository: IRecipeRepository;
    let rabbitmqProducer: IRabbitMQProducer;
    let eventsLogsRepository: IEventsLogsRepository;

    beforeEach(() => {
        orderRepository = {
            create: jest.fn(),
            listAll: jest.fn(),
            countAll: jest.fn(),
            findById: jest.fn(),
        } as unknown as IOrderRepository;

        recipeRepository = {
            getRandomRecipe: jest.fn(),
        } as unknown as IRecipeRepository;

        rabbitmqProducer = {
            publish: jest.fn(),
        } as unknown as IRabbitMQProducer;

        eventsLogsRepository = {
            create: jest.fn(),
        } as unknown as IEventsLogsRepository;

        ordersService = new OrdersService(
            orderRepository,
            recipeRepository,
            rabbitmqProducer,
            eventsLogsRepository
        );
    });

    describe('createOrder', () => {
        it('should create an order and send an event', async () => {
            const mockRecipe = { id: 1 };
            const createdOrder = { id: 2, recipeId: mockRecipe.id, status: OrderStatus.PREPARING };
            
            recipeRepository.getRandomRecipe = jest.fn().mockResolvedValue(mockRecipe);
            orderRepository.create = jest.fn().mockResolvedValue(createdOrder);

            const result = await ordersService.createOrder();

            expect(recipeRepository.getRandomRecipe).toHaveBeenCalled();
            expect(orderRepository.create).toHaveBeenCalledWith(mockRecipe.id, OrderStatus.PREPARING);
            expect(result).toEqual(createdOrder);
        });

        it('should handle errors when sending order create events', async () => {
            const mockRecipe = { id: 1 };
            const createdOrder = { id: 2, recipeId: mockRecipe.id, status: OrderStatus.PREPARING };

            recipeRepository.getRandomRecipe = jest.fn().mockResolvedValue(mockRecipe);
            orderRepository.create = jest.fn().mockResolvedValue(createdOrder);
            rabbitmqProducer.publish = jest.fn().mockRejectedValue(new Error('Publish error'));

            await ordersService.createOrder();

            expect(eventsLogsRepository.create).toHaveBeenCalledWith(
                Events.CREATE_ORDER,
                expect.anything(),
                EventLogsState.CREATED_FAILED,
                expect.any(String)
            );
        });
    });

    describe('listAllOrders', () => {
        it('should return all orders with pagination info', async () => {
            const filters: OrderFilter = { page: 1, perPage: 10 }; // Adjust based on your OrderFilter structure
            const mockData = [{ id: 1, status: OrderStatus.PREPARING }];
            const totalCount = 1;

            orderRepository.listAll = jest.fn().mockResolvedValue(mockData);
            orderRepository.countAll = jest.fn().mockResolvedValue(totalCount);

            const result = await ordersService.listAllOrders(filters);

            expect(result).toEqual({ data: mockData, page: filters.page, perPage: filters.perPage, total: totalCount });
            expect(orderRepository.listAll).toHaveBeenCalledWith(filters);
            expect(orderRepository.countAll).toHaveBeenCalled();
        });
    });

    describe('getOrderById', () => {
        it('should return order by ID', async () => {
            const orderId = 1;
            const mockOrder = { id: orderId, status: OrderStatus.PREPARING };

            orderRepository.findById = jest.fn().mockResolvedValue(mockOrder);

            const result = await ordersService.getOrderById(orderId);

            expect(result).toEqual(mockOrder);
            expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
        });
    });
});