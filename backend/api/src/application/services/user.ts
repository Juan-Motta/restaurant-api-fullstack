import { ApiError } from '../../domain/exceptions/custom'
import { IUserRepository } from '../../domain/repositories/users'
import { IPasswordManager } from '../../domain/utils/password'

export class UserService {
    private userRepository: IUserRepository
    private passwordManager: IPasswordManager

    constructor(
        userRepository: IUserRepository,
        passwordManager: IPasswordManager
    ) {
        this.userRepository = userRepository
        this.passwordManager = passwordManager
    }

    public async getUserByEmail(email: string) {
        const user = await this.userRepository.findByEmail(email)
        return user
    }

    public async validateName(name: string) {
        if (name.length < 3) {
            throw new ApiError('Name is too short', 400)
        }
    }

    public async validateEmail(email: string) {
        if (!email.includes('@')) {
            throw new ApiError('Invalid email', 400)
        }
    }

    public async validatePassword(
        password: string,
        passwordConfirmation: string
    ) {
        if (password.length < 8) {
            throw new ApiError('Password is too short', 400)
        }
        if (password !== passwordConfirmation) {
            throw new ApiError('Passwords do not match', 400)
        }
    }

    public async createUser(
        name: string,
        email: string,
        password: string,
        passwordConfirmation: string
    ) {
        await this.validateName(name)
        await this.validateEmail(email)
        await this.validatePassword(password, passwordConfirmation)

        const existingUser = await this.getUserByEmail(email)
        if (existingUser) {
            throw new ApiError('User already exists', 400)
        }

        const hashedPassword = this.passwordManager.generatePassword(password)

        const user = await this.userRepository.create({
            name: name,
            email: email,
            password: hashedPassword
        })

        return user
    }
}
