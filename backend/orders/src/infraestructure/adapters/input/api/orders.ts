import * as http from 'http'

import { db } from '../../output/database'
import Logger from '../../../config/logger'
import { getOrderService, getAuthService } from '../../../dependencies/services'

export async function createOrderController(
    req: http.IncomingMessage,
    res: http.ServerResponse,
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
    req: http.IncomingMessage,
    res: http.ServerResponse
) {
    Logger.info('Listing all orders')
    const client = await db.connect()

    const authService = await getAuthService(client)
    await authService.verifyHeader(req)

    const orderService = await getOrderService(client)
    const response = await orderService.listAllOrders()
    
    client.release()
    res.statusCode = 200
    res.end(JSON.stringify(response))
}
