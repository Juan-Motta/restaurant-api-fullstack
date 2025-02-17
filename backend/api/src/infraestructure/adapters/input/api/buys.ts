import * as http from 'http'

import { db } from '../../output/database'
import Logger from '../../../config/logger'
import { getAuthService } from '../../../dependencies/services'
import { getBuysService } from '../../../dependencies/services'

export async function listAllBuysController(
    req: http.IncomingMessage,
    res: http.ServerResponse
) {
    Logger.info('Listing all buys')
    const client = await db.connect()

    const authService = await getAuthService(client)
    await authService.verifyHeader(req)

    const orderService = await getBuysService(client)
    const response = await orderService.listAllBuys()

    client.release()
    res.statusCode = 200
    res.end(JSON.stringify(response))
}
