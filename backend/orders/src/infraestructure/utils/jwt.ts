import jwt from 'jsonwebtoken'
import { settings } from '../../infraestructure/config/settings'
import { IJwtManager } from '../../domain/utils/jwt'

export class JwtManager implements IJwtManager {
    public verify(token: string) {
        return jwt.verify(token, settings.JWT_SECRET)
    }
}
