import { HttpResponse, HttpRequest } from '../../../../app'

import { db } from '../../output/database'
import Logger from '../../../config/logger'
import {
    getStorageService,
    getAuthService
} from '../../../dependencies/services'
import { IngredientFilterValidator } from '../../../../domain/filters/ingredients'

export async function listAllIngredients(req: HttpRequest, res: HttpResponse) {
    Logger.info('Getting all ingredients')
    const client = await db.connect()

    const authService = await getAuthService(client)
    await authService.verifyHeader(req)

    const filters = IngredientFilterValidator.validate(req.query)

    const storageService = await getStorageService(client)
    const response = await storageService.getAllIngredients(filters)

    client.release()
    res.statusCode = 200
    res.end(JSON.stringify(response))
}
