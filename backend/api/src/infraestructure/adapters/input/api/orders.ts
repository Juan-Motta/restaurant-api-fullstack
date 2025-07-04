import { db } from '../../output/database'
import Logger from '../../../config/logger'
import { getOrderService, getAuthService } from '../../../dependencies/services'

import { HttpRequest, HttpResponse } from '../../../../app'
import {
    OrderFilterValidator,
    OrderFilter
} from '../../../../domain/filters/orders'

export async function createOrderController(
    req: HttpRequest,
    res: HttpResponse
) {
    Logger.info('Creating order')
    const client = await db.connect()

    const authService = await getAuthService(client)
    await authService.verifyHeader(req)

    const orderService = await getOrderService(client)
    const response = await orderService.createOrder()

    client.release()
    res.statusCode = 200
    res.end(JSON.stringify(response))
}

export async function listAllOrdersController(
    req: HttpRequest,
    res: HttpResponse
) {
    Logger.info('Listing all orders')
    const client = await db.connect()
    const authService = await getAuthService(client)
    await authService.verifyHeader(req)

    const filters = OrderFilterValidator.validate(req.query)

    const orderService = await getOrderService(client)
    const response = await orderService.listAllOrders(filters)

    client.release()
    res.statusCode = 200
    res.end(JSON.stringify(response))
}

export async function getOrderController(req: HttpRequest, res: HttpResponse) {
    Logger.info('Get order')
    const client = await db.connect()

    const authService = await getAuthService(client)
    await authService.verifyHeader(req)

    if (!req.params?.id) {
        res.statusCode = 400
        res.end(JSON.stringify({ message: 'Missing id parameter' }))
        return
    }

    const id = parseInt(req.params?.id)

    if (isNaN(id)) {
        res.statusCode = 400
        res.end(JSON.stringify({ message: 'Invalid id parameter' }))
        return
    }

    const orderService = await getOrderService(client)
    const response = await orderService.getOrderById(id)

    client.release()
    res.statusCode = 200
    res.end(JSON.stringify(response))
}

export async function getOrdersResumeController(
    req: HttpRequest,
    res: HttpResponse
) {
    Logger.info('Get orders resume')
    const client = await db.connect()

    const authService = await getAuthService(client)
    await authService.verifyHeader(req)

    const orderService = await getOrderService(client)
    const response = await orderService.getOrdersResume()

    client.release()
    res.statusCode = 200
    res.end(JSON.stringify(response))
}
