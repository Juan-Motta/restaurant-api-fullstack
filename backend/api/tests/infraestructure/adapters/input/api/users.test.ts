import * as http from 'http'
import { HttpRequest } from '../../../../../src/app'
import {
    loginController,
    registerUserController
} from '../../../../../src/infraestructure/adapters/input/api/users'
import {
    getAuthService,
    getUserService
} from '../../../../../src/infraestructure/dependencies/services'
import { db } from '../../../../../src/infraestructure/adapters/output/database/index'

jest.mock('../../../../../src/infraestructure/dependencies/services')
jest.mock('../../../../../src/infraestructure/adapters/output/database/index')

const mockClient = {
    release: jest.fn()
}

const mockAuthService = {
    login: jest.fn()
}

const mockUserService = {
    createUser: jest.fn()
}

beforeEach(() => {
    jest.clearAllMocks()
    ;(db.connect as jest.Mock).mockResolvedValue(mockClient)
    ;(getAuthService as jest.Mock).mockResolvedValue(mockAuthService)
    ;(getUserService as jest.Mock).mockResolvedValue(mockUserService)
})

describe('User Controllers', () => {
    describe('loginController', () => {
        it('should log in user and respond with 200', async () => {
            const mockResponse = { token: '12345' }
            mockAuthService.login.mockResolvedValue(mockResponse)

            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password'
                } as Record<string, string>
            } as HttpRequest
            const res = {
                statusCode: 0,
                end: jest.fn()
            } as unknown as http.ServerResponse

            await loginController(req, res)

            expect(getAuthService).toHaveBeenCalledWith(mockClient)
            expect(mockAuthService.login).toHaveBeenCalledWith(
                'test@example.com',
                'password'
            )
            expect(res.statusCode).toBe(200)
            expect(res.end).toHaveBeenCalledWith(JSON.stringify(mockResponse))
        })
    })

    describe('registerUserController', () => {
        it('should register user and respond with 201', async () => {
            const mockResponse = { id: '1', name: 'Test User' }
            mockUserService.createUser.mockResolvedValue(mockResponse)

            const body = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
                confirmPassword: 'password'
            }

            const req = {
                body: body as Record<string, string>
            } as HttpRequest
            const res = {
                statusCode: 0,
                end: jest.fn()
            } as unknown as http.ServerResponse

            await registerUserController(req, res)

            expect(getUserService).toHaveBeenCalledWith(mockClient)
            expect(mockUserService.createUser).toHaveBeenCalledWith(
                body.name,
                body.email,
                body.password,
                body.confirmPassword
            )
            expect(res.statusCode).toBe(201)
            expect(res.end).toHaveBeenCalledWith(JSON.stringify(mockResponse))
        })
    })
})
