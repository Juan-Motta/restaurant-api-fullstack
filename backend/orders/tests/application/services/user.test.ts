import { UserService } from '../../../src/application/services/user'
import { IUserRepository } from '../../../src/domain/repositories/users'
import { IPasswordManager } from '../../../src/domain/utils/password'
import { ApiError } from '../../../src/domain/exceptions/custom'

describe('UserService', () => {
    let userRepository: jest.Mocked<IUserRepository>
    let passwordManager: jest.Mocked<IPasswordManager>
    let userService: UserService

    beforeEach(() => {
        userRepository = {
            findByEmail: jest.fn(),
            create: jest.fn()
        } as unknown as jest.Mocked<IUserRepository>

        passwordManager = {
            generatePassword: jest.fn()
        } as unknown as jest.Mocked<IPasswordManager>

        userService = new UserService(userRepository, passwordManager)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('createUser', () => {
        it('should throw an error if the name is too short', async () => {
            await expect(
                userService.createUser(
                    'Jo',
                    'test@example.com',
                    'password123',
                    'password123'
                )
            ).rejects.toThrow(ApiError)
        })

        it('should throw an error if the email is invalid', async () => {
            await expect(
                userService.createUser(
                    'John Doe',
                    'invalidEmail',
                    'password123',
                    'password123'
                )
            ).rejects.toThrow(ApiError)
        })

        it('should throw an error if the password is too short', async () => {
            await expect(
                userService.createUser(
                    'John Doe',
                    'test@example.com',
                    'short',
                    'short'
                )
            ).rejects.toThrow(ApiError)
        })

        it('should throw an error if passwords do not match', async () => {
            await expect(
                userService.createUser(
                    'John Doe',
                    'test@example.com',
                    'password123',
                    'differentPassword'
                )
            ).rejects.toThrow(ApiError)
        })

        it('should throw an error if the user already exists', async () => {
            userRepository.findByEmail.mockResolvedValue({
                id: 1,
                name: 'John Doe',
                email: 'test@example.com',
                password: 'hashed_password',
                createdAt: new Date()
            })

            await expect(
                userService.createUser(
                    'John Doe',
                    'test@example.com',
                    'password123',
                    'password123'
                )
            ).rejects.toThrow(ApiError)
        })

        it('should create a user successfully', async () => {
            userRepository.findByEmail.mockResolvedValue(null)
            const hashedPassword = 'hashed_password'
            passwordManager.generatePassword.mockReturnValue(hashedPassword)

            const userInput = {
                name: 'John Doe',
                email: 'test@example.com',
                password: 'password123',
                passwordConfirmation: 'password123'
            }

            userRepository.create.mockResolvedValue({
                id: 1,
                name: userInput.name,
                email: userInput.email,
                password: hashedPassword
            })

            const newUser = await userService.createUser(
                userInput.name,
                userInput.email,
                userInput.password,
                userInput.passwordConfirmation
            )

            expect(newUser).toBeDefined()
            expect(newUser.name).toBe(userInput.name)
            expect(newUser.email).toBe(userInput.email)
            expect(userRepository.create).toHaveBeenCalledWith({
                name: userInput.name,
                email: userInput.email,
                password: hashedPassword
            })
        })
    })
})
