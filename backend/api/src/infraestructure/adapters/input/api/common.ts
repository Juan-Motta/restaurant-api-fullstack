import { HttpResponse, HttpRequest } from '../../../../app'
import Logger from '../../../config/logger'

export async function healthCheckController(
    req: HttpRequest,
    res: HttpResponse
) {
    Logger.info('Health check')

    res.statusCode = 200
    res.end(JSON.stringify({status: 'ok'}))
}
