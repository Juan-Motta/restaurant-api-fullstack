import { OrderStatus } from '../entities/orders'
import { ApiError } from '../exceptions/custom'

export interface OrderFilter {
    page: number
    perPage: number
    orderId?: number | null
    orderStatus?: string | null
}

export class OrderFilterValidator {
    static validatePage(page: string) {
        if (isNaN(Number(page))) {
            throw new ApiError('Page must be a number', 400)
        }
    }

    static validatePerPage(perPage: string) {
        if (isNaN(Number(perPage))) {
            throw new ApiError('PerPage must be a number', 400)
        }
    }

    static validateOrderId(orderId: string) {
        if (isNaN(Number(orderId))) {
            throw new ApiError('OrderId must be a number', 400)
        }
    }

    static validateOrderStatus(orderStatus: string) {
        if (orderStatus === '') {
            throw new ApiError('OrderStatus must not be empty', 400)
        }
        if (!Object.values(OrderStatus).includes(orderStatus as OrderStatus)) {
            throw new ApiError('OrderStatus must be a valid OrderStatus', 400)
        }
    }

    static validate(query: any) {
        let filters = {
            page: 1,
            perPage: 10,
            orderId: null,
            orderStatus: null
        } as OrderFilter
        if (query.page) {
            this.validatePage(query.page)
            filters.page = parseInt(query.page)
        }
        if (query.perPage) {
            this.validatePerPage(query.perPage)
            filters.perPage = parseInt(query.perPage)
        }
        if (query.orderId) {
            this.validateOrderId(query.orderId)
            filters.orderId = parseInt(query.orderId)
        }
        if (query.orderStatus) {
            this.validateOrderStatus(query.orderStatus)
            filters.orderStatus = query.orderStatus
        }
        return filters
    }
}
