import jwt from 'jsonwebtoken'
import { JwtManager } from '../../../src/infraestructure/utils/jwt'
import { settings } from '../../../src/infraestructure/config/settings'
import { IJwtManager } from '../../../src/domain/utils/jwt'

jest.mock('../../../src/infraestructure/config/settings', () => ({
    settings: {
        JWT_SECRET: 'your_secret',
        JWT_EXPIRATION: '60'
    }
}))

describe('JwtManager', () => {
    let jwtManager: IJwtManager

    beforeEach(() => {
        jwtManager = new JwtManager()
    })

    it('should sign a payload and return a valid JWT', () => {
        const payload = { userId: 1 }
        const token = jwtManager.sign(payload)

        expect(typeof token).toBe('string')

        const decoded = jwt.verify(token, settings.JWT_SECRET)

        expect(decoded).toEqual(expect.objectContaining(payload))
    })

    it('should set the correct expiration for the token', () => {
        const payload = { userId: 1 }
        const token = jwtManager.sign(payload)

        const decoded: any = jwt.decode(token)

        const expectedExpiration =
            Math.floor(Date.now() / 1000) + parseInt(settings.JWT_EXPIRATION)
        expect(decoded.exp).toBeCloseTo(expectedExpiration, 1)
    })
})
