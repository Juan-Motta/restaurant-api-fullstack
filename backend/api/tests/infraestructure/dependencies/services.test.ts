import {
    getUserService,
    getAuthService
} from '../../../src/infraestructure/dependencies/services'
import { PoolClient } from 'pg'
import { UserService } from '../../../src/application/services/user'
import { AuthService } from '../../../src/application/services/auth'

jest.mock('../../../src/infraestructure/adapters/output/repository/users')
jest.mock('../../../src/infraestructure/utils/password')
jest.mock('../../../src/infraestructure/utils/jwt')
jest.mock('../../../src/application/services/user')
jest.mock('../../../src/application/services/auth')

describe('Service Factory Functions', () => {
    let mockClient: PoolClient

    beforeEach(() => {
        mockClient = {} as PoolClient
    })

    it('should return an instance of UserService', async () => {
        const userService = await getUserService(mockClient)
        expect(userService).toBeInstanceOf(UserService)
    })

    it('should return an instance of AuthService', async () => {
        const authService = await getAuthService(mockClient)
        expect(authService).toBeInstanceOf(AuthService)
    })
})
