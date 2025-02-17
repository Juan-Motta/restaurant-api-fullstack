import { HttpResponse, HttpRequest } from '../../../../app'

import { db } from '../../output/database'
import Logger from '../../../config/logger'
import { getAuthService } from '../../../dependencies/services'
import { getBuysService } from '../../../dependencies/services'
import { BuyFilterValidator } from '../../../../domain/filters/buys'

export async function listAllBuysController(
    req: HttpRequest,
    res: HttpResponse
) {
    Logger.info('Listing all buys')
    const client = await db.connect()

    const authService = await getAuthService(client)
    await authService.verifyHeader(req)

    const filters = BuyFilterValidator.validate(req.query)

    const orderService = await getBuysService(client)
    const response = await orderService.listAllBuys(filters)

    client.release()
    res.statusCode = 200
    res.end(JSON.stringify(response))
}
