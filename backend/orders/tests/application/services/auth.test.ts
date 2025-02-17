import { AuthService } from '../../../src/application/services/auth'
import { IUserRepository } from '../../../src/domain/repositories/users'
import { IPasswordManager } from '../../../src/domain/utils/password'
import { IJwtManager } from '../../../src/domain/utils/jwt'
import { ApiError } from '../../../src/domain/exceptions/custom'

describe('AuthService', () => {
    let userRepository: jest.Mocked<IUserRepository>
    let passwordManager: jest.Mocked<IPasswordManager>
    let jwtManager: jest.Mocked<IJwtManager>
    let authService: AuthService

    beforeEach(() => {
        userRepository = {
            findByEmail: jest.fn()
        } as unknown as jest.Mocked<IUserRepository>

        passwordManager = {
            verifyPassword: jest.fn()
        } as unknown as jest.Mocked<IPasswordManager>

        jwtManager = {
            sign: jest.fn()
        } as unknown as jest.Mocked<IJwtManager>

        authService = new AuthService(
            userRepository,
            passwordManager,
            jwtManager
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('login', () => {
        it('should throw an error if the email is invalid', async () => {
            await expect(
                authService.login('invalidEmail', 'password')
            ).rejects.toThrow(ApiError)
        })

        it('should throw an error if the user is not found', async () => {
            userRepository.findByEmail.mockResolvedValue(null)
            await expect(
                authService.login('test@example.com', 'password')
            ).rejects.toThrow(ApiError)
        })

        it('should throw an error if the password is invalid', async () => {
            userRepository.findByEmail.mockResolvedValue({
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashed_password'
            })

            passwordManager.verifyPassword.mockReturnValue(false)
            await expect(
                authService.login('test@example.com', 'wrong_password')
            ).rejects.toThrow(ApiError)
        })

        it('should return a valid access token on successful login', async () => {
            userRepository.findByEmail.mockResolvedValue({
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashed_password'
            })

            passwordManager.verifyPassword.mockReturnValue(true)
            jwtManager.sign.mockReturnValue('generated_jwt_token')

            const result = await authService.login(
                'test@example.com',
                'password'
            )

            expect(result).toEqual({ accessToken: 'generated_jwt_token' })
            expect(jwtManager.sign).toHaveBeenCalledWith({
                userId: 1,
                userEmail: 'test@example.com',
                userName: 'Test User'
            })
        })
    })

    describe('validateEmail', () => {
        it('should throw an error if the email is invalid', async () => {
            await expect(
                authService.validateEmail('invalidEmail')
            ).rejects.toThrow(ApiError)
        })

        it('should not throw an error if the email is valid', async () => {
            await expect(
                authService.validateEmail('test@example.com')
            ).resolves.toBeUndefined()
        })
    })
})
