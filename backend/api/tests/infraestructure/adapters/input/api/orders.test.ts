import { db } from '../../../../../src/infraestructure/adapters/output/database/index'
import Logger from '../../../../../src/infraestructure/config/logger'
import {
    createOrderController,
    listAllOrdersController,
    getOrderController
} from '../../../../../src/infraestructure/adapters/input/api/orders'
import {
    getOrderService,
    getAuthService
} from '../../../../../src/infraestructure/dependencies/services'
import { HttpRequest, HttpResponse } from '../../../../../src/app'
import { OrderFilterValidator } from '../../../../../src/domain/filters/orders'

jest.mock(
    '../../../../../src/infraestructure/adapters/output/database/index',
    () => ({
        db: {
            connect: jest.fn()
        }
    })
)

jest.mock('../../../../../src/infraestructure/dependencies/services', () => ({
    getOrderService: jest.fn(),
    getAuthService: jest.fn()
}))

jest.mock('../../../../../src/domain/filters/orders', () => ({
    OrderFilterValidator: {
        validate: jest.fn()
    }
}))

jest.mock('../../../../../src/infraestructure/config/logger')

describe('Order Controllers', () => {
    let req: HttpRequest
    let res: HttpResponse
    let mockClient: any

    beforeEach(() => {
        req = {
            query: {},
            params: {}
        } as HttpRequest

        res = {
            statusCode: 0,
            end: jest.fn()
        } as any

        mockClient = {
            release: jest.fn()
        }
        ;(db.connect as jest.Mock).mockResolvedValue(mockClient)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('createOrderController', () => {
        it('should create an order successfully', async () => {
            const mockAuthService = {
                verifyHeader: jest.fn()
            }
            const mockOrderService = {
                createOrder: jest
                    .fn()
                    .mockResolvedValue({ id: 1, status: 'PREPARING' })
            }

            ;(getAuthService as jest.Mock).mockResolvedValue(mockAuthService)
            ;(getOrderService as jest.Mock).mockResolvedValue(mockOrderService)

            await createOrderController(req, res)

            expect(db.connect).toHaveBeenCalled()
            expect(mockAuthService.verifyHeader).toHaveBeenCalledWith(req)
            expect(getOrderService).toHaveBeenCalledWith(mockClient)
            expect(mockOrderService.createOrder).toHaveBeenCalled()
            expect(mockClient.release).toHaveBeenCalled()
            expect(res.statusCode).toBe(200)
            expect(res.end).toHaveBeenCalledWith(
                JSON.stringify({ id: 1, status: 'PREPARING' })
            )
        })
    })

    describe('listAllOrdersController', () => {
        it('should list all orders successfully', async () => {
            const mockAuthService = {
                verifyHeader: jest.fn()
            }
            const mockOrderService = {
                listAllOrders: jest.fn().mockResolvedValue({
                    data: [],
                    page: 1,
                    perPage: 10,
                    total: 0
                })
            }

            ;(getAuthService as jest.Mock).mockResolvedValue(mockAuthService)
            ;(getOrderService as jest.Mock).mockResolvedValue(mockOrderService)
            ;(OrderFilterValidator.validate as jest.Mock).mockReturnValue({})

            await listAllOrdersController(req, res)

            expect(db.connect).toHaveBeenCalled()
            expect(mockAuthService.verifyHeader).toHaveBeenCalledWith(req)
            expect(OrderFilterValidator.validate).toHaveBeenCalledWith(
                req.query
            )
            expect(getOrderService).toHaveBeenCalledWith(mockClient)
            expect(mockOrderService.listAllOrders).toHaveBeenCalledWith({})
            expect(mockClient.release).toHaveBeenCalled()
            expect(res.statusCode).toBe(200)
            expect(res.end).toHaveBeenCalledWith(
                JSON.stringify({ data: [], page: 1, perPage: 10, total: 0 })
            )
        })
    })

    describe('getOrderController', () => {
        it('should get order by ID successfully', async () => {
            const mockAuthService = {
                verifyHeader: jest.fn()
            }
            const mockOrderService = {
                getOrderById: jest
                    .fn()
                    .mockResolvedValue({ id: 1, status: 'PREPARING' })
            }

            ;(req.params as Record<string, string>).id = '1'
            ;(getAuthService as jest.Mock).mockResolvedValue(mockAuthService)
            ;(getOrderService as jest.Mock).mockResolvedValue(mockOrderService)

            await getOrderController(req, res)

            expect(db.connect).toHaveBeenCalled()
            expect(mockAuthService.verifyHeader).toHaveBeenCalledWith(req)
            expect(getOrderService).toHaveBeenCalledWith(mockClient)
            expect(mockOrderService.getOrderById).toHaveBeenCalledWith(1)
            expect(mockClient.release).toHaveBeenCalled()
            expect(res.statusCode).toBe(200)
            expect(res.end).toHaveBeenCalledWith(
                JSON.stringify({ id: 1, status: 'PREPARING' })
            )
        })

        it('should return error for missing id parameter', async () => {
            const mockAuthService = {
                verifyHeader: jest.fn()
            }

            ;(getAuthService as jest.Mock).mockResolvedValue(mockAuthService)

            await getOrderController(req, res)

            expect(res.statusCode).toBe(400)
            expect(res.end).toHaveBeenCalledWith(
                JSON.stringify({ message: 'Missing id parameter' })
            )
        })

        it('should return error for invalid id parameter', async () => {
            ;(req.params as Record<string, string>).id = 'abc'

            const mockAuthService = {
                verifyHeader: jest.fn()
            }

            ;(getAuthService as jest.Mock).mockResolvedValue(mockAuthService)

            await getOrderController(req, res)

            expect(res.statusCode).toBe(400)
            expect(res.end).toHaveBeenCalledWith(
                JSON.stringify({ message: 'Invalid id parameter' })
            )
        })
    })
})
