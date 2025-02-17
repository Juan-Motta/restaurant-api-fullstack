import * as http from 'http'

import { db } from '../../output/database'
import Logger from '../../../config/logger'
import { getStorageService, getAuthService } from '../../../dependencies/services'

export async function getAllIngredients(
    req: http.IncomingMessage,
    res: http.ServerResponse,
) {
    Logger.info('Getting all ingredients')
    const client = await db.connect()

    const authService = await getAuthService(client)
    await authService.verifyHeader(req)

    const storageService = await getStorageService(client)
    const response = await storageService.getAllIngredients()
    
    client.release()
    res.statusCode = 200
    res.end(JSON.stringify(response))
}