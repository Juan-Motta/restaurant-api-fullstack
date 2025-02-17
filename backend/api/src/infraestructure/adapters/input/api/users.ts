import { HttpRequest, HttpResponse } from '../../../../app'

import { getUserService, getAuthService } from '../../../dependencies/services'
import { db } from '../../output/database'
import { type CreateUserInput } from '../../../../domain/entities/users'
import Logger from '../../../config/logger'

export async function loginController(req: HttpRequest, res: HttpResponse) {
    Logger.info('Logging in user')
    const client = await db.connect()
    const body = req.body as { email: string; password: string }
    const service = await getAuthService(client)
    const response = await service.login(body.email, body.password)
    client.release()
    res.statusCode = 200
    res.end(JSON.stringify(response))
}

export async function registerUserController(
    req: HttpRequest,
    res: HttpResponse
) {
    Logger.info('Registering user')
    const client = await db.connect()
    const body = req.body as CreateUserInput
    const service = await getUserService(client)
    const response = await service.createUser(
        body.name,
        body.email,
        body.password,
        body.confirmPassword
    )
    client.release()
    res.statusCode = 201
    res.end(JSON.stringify(response))
}
