import jwt from 'jsonwebtoken'
import { settings } from '../../infraestructure/config/settings'
import { IJwtManager } from '../../domain/utils/jwt'

export class JwtManager implements IJwtManager {
    public sign(payload: object): string {
        const expiresIn = parseInt(settings.JWT_EXPIRATION)
        return jwt.sign(payload, settings.JWT_SECRET as string, { expiresIn })
    }

    public verify(token: string) {
        return jwt.verify(token, settings.JWT_SECRET)
    }
}
