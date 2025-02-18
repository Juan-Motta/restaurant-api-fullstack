import { PoolClient } from 'pg';
import { OrderRepository } from '../../../../../src/infraestructure/adapters/output/repository/orders';
import { OrderStatus, Order } from '../../../../../src/domain/entities/orders';

describe('OrderRepository', () => {
    let client: PoolClient;
    let orderRepository: OrderRepository;

    beforeEach(() => {
        client = {
            query: jest.fn(),
        } as unknown as PoolClient;
        orderRepository = new OrderRepository(client);
    });

    describe('findById', () => {
        it('should return an order by its ID', async () => {
            const mockQueryResult = {
                rows: [
                    {
                        orderid: '1',
                        recipeid: '1',
                        recipename: 'Pasta',
                        orderstatus: 'PREPARING',
                        ordercreatedat: '2021-01-01T00:00:00.000Z',
                    },
                ],
            };

            client.query = jest.fn().mockResolvedValue(mockQueryResult);

            const result = await orderRepository.findById(1);

            expect(result).toEqual({
                id: 1,
                recipe: { id: 1, name: 'Pasta' },
                status: 'PREPARING',
                createdAt: '2021-01-01T00:00:00.000Z',
            });
            expect(client.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE o.id = $1'),
                [1]
            );
        });

        it('should return null if no order is found', async () => {
            const mockQueryResult = { rows: [] };
            client.query = jest.fn().mockResolvedValue(mockQueryResult);

            const result = await orderRepository.findById(999);

            expect(result).toBeNull();
        });
    });

    describe('updateStatus', () => {
        it('should update the status of an order and return the updated order', async () => {
            const orderId = 1;
            const newStatus = OrderStatus.FINISHED;

            const updateResult = {
                rows: [{ id: 1 }],
            };

            client.query = jest.fn()
                .mockResolvedValueOnce(updateResult)
                .mockResolvedValueOnce({
                    rows: [
                        {
                            orderid: '1',
                            recipeid: '1',
                            recipename: 'Pasta',
                            orderstatus: 'COMPLETED',
                            ordercreatedat: '2021-01-01T00:00:00.000Z',
                        },
                    ],
                });

            const result = await orderRepository.updateStatus(orderId, newStatus);

            expect(result).toEqual({
                id: 1,
                recipe: { id: 1, name: 'Pasta' },
                status: 'COMPLETED',
                createdAt: '2021-01-01T00:00:00.000Z',
            });
            expect(client.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE orders SET status = $1 WHERE id = $2'),
                [newStatus, orderId]
            );
        });
    });
});