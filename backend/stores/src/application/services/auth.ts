import * as http from 'http'

import { ApiError } from '../../domain/exceptions/custom'
import { IJwtManager } from '../../domain/utils/jwt'

export class AuthService {
    private jwtManager: IJwtManager

    constructor(
        jwtManager: IJwtManager
    ) {
        this.jwtManager = jwtManager
    }

    public async verifyHeader(req: http.IncomingMessage) {
        const header = req.headers['authorization']
        if (!header) {
            throw new ApiError('Unauthorized', 401)
        }
        const type = header.split(' ')[0]
        const token = header.split(' ')[1]
        if (type !== 'Bearer') {
            throw new ApiError('Unauthorized', 401)
        }
        await this.verifyJwt(token)
    }

    public async verifyJwt(
        token: string
    ) {
        try {
            const decoded = this.jwtManager.verify(token)
            return decoded
        } catch (error) {
            throw new ApiError('Unauthorized', 401)
        }
    }
}
