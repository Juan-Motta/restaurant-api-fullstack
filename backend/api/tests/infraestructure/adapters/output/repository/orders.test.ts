import { PoolClient } from 'pg'
import { OrderRepository } from '../../../../../src/infraestructure/adapters/output/repository/orders'
import { OrderStatus } from '../../../../../src/domain/entities/orders'

describe('OrderRepository', () => {
    let client: PoolClient
    let orderRepository: OrderRepository

    beforeEach(() => {
        client = {
            query: jest.fn()
        } as unknown as PoolClient
        orderRepository = new OrderRepository(client)
    })

    describe('countAll', () => {
        it('should return the count of all orders', async () => {
            const mockCountResult = { rows: [{ count: '5' }] }
            client.query = jest.fn().mockResolvedValue(mockCountResult)

            const result = await orderRepository.countAll()

            expect(result).toBe(5)
            expect(client.query).toHaveBeenCalledWith(
                'SELECT COUNT(*) FROM orders'
            )
        })
    })

    describe('listAll', () => {
        it('should return a list of orders based on filters', async () => {
            const filters = {
                orderStatus: OrderStatus.PREPARING,
                orderId: 1,
                page: 1,
                perPage: 10
            }

            const mockQueryResult = {
                rows: [
                    {
                        orderid: '1',
                        recipeid: '1',
                        recipename: 'Pasta',
                        orderstatus: 'PREPARING',
                        ordercreatedat: '2021-01-01T00:00:00.000Z'
                    }
                ]
            }

            client.query = jest.fn().mockResolvedValue(mockQueryResult)

            const result = await orderRepository.listAll(filters)

            expect(result).toEqual([
                {
                    id: 1,
                    recipe: { id: 1, name: 'Pasta' },
                    status: 'PREPARING',
                    createdAt: '2021-01-01T00:00:00.000Z'
                }
            ])
            expect(client.query).toHaveBeenCalled()
        })

        it('should build the correct SQL query with filters', async () => {
            const filters = {
                orderStatus: OrderStatus.PREPARING,
                page: 1,
                perPage: 10
            }

            const mockQueryResult = { rows: [] }
            client.query = jest.fn().mockResolvedValue(mockQueryResult)

            await orderRepository.listAll(filters)

            expect(client.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE'),
                [filters.orderStatus, filters.perPage, 0]
            )
        })

        it('should return an empty array when no orders match the filters', async () => {
            const filters = {
                orderStatus: OrderStatus.FINISHED,
                page: 1,
                perPage: 10
            }

            const mockQueryResult = { rows: [] }
            client.query = jest.fn().mockResolvedValue(mockQueryResult)

            const result = await orderRepository.listAll(filters)

            expect(result).toEqual([])
        })
    })

    describe('findById', () => {
        it('should return an order by its ID', async () => {
            const mockQueryResult = {
                rows: [
                    {
                        orderid: '1',
                        recipeid: '1',
                        recipename: 'Pasta',
                        orderstatus: 'PREPARING',
                        ordercreatedat: '2021-01-01T00:00:00.000Z'
                    }
                ]
            }

            client.query = jest.fn().mockResolvedValue(mockQueryResult)

            const result = await orderRepository.findById(1)

            expect(result).toEqual({
                id: 1,
                recipe: { id: 1, name: 'Pasta' },
                status: 'PREPARING',
                createdAt: '2021-01-01T00:00:00.000Z'
            })
            expect(client.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE o.id = $1'),
                [1]
            )
        })

        it('should return null if no order is found', async () => {
            const mockQueryResult = { rows: [] }
            client.query = jest.fn().mockResolvedValue(mockQueryResult)

            const result = await orderRepository.findById(999)

            expect(result).toBeNull()
        })
    })

    describe('create', () => {
        it('should create a new order and return it', async () => {
            const recipe_id = 1
            const status = OrderStatus.PREPARING

            const createResult = {
                rows: [{ id: 1 }]
            }

            client.query = jest
                .fn()
                .mockResolvedValueOnce(createResult)
                .mockResolvedValueOnce({
                    rows: [
                        {
                            orderid: '1',
                            recipeid: '1',
                            recipename: 'Pasta',
                            orderstatus: 'PREPARING',
                            ordercreatedat: '2021-01-01T00:00:00.000Z'
                        }
                    ]
                })

            const result = await orderRepository.create(recipe_id, status)

            expect(result).toEqual({
                id: 1,
                recipe: { id: 1, name: 'Pasta' },
                status: 'PREPARING',
                createdAt: '2021-01-01T00:00:00.000Z'
            })
            expect(client.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO orders'),
                [recipe_id, status]
            )
        })
    })

    describe('updateStatus', () => {
        it('should update the status of an order and return the updated order', async () => {
            const orderId = 1
            const newStatus = OrderStatus.FINISHED

            const updateResult = {
                rows: [{ id: 1 }]
            }

            client.query = jest
                .fn()
                .mockResolvedValueOnce(updateResult)
                .mockResolvedValueOnce({
                    rows: [
                        {
                            orderid: '1',
                            recipeid: '1',
                            recipename: 'Pasta',
                            orderstatus: 'COMPLETED',
                            ordercreatedat: '2021-01-01T00:00:00.000Z'
                        }
                    ]
                })

            const result = await orderRepository.updateStatus(
                orderId,
                newStatus
            )

            expect(result).toEqual({
                id: 1,
                recipe: { id: 1, name: 'Pasta' },
                status: 'COMPLETED',
                createdAt: '2021-01-01T00:00:00.000Z'
            })
            expect(client.query).toHaveBeenCalledWith(
                expect.stringContaining(
                    'UPDATE orders SET status = $1 WHERE id = $2'
                ),
                [newStatus, orderId]
            )
        })
    })
})
