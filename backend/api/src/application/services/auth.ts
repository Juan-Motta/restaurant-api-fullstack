import * as http from 'http'
import { ApiError } from '../../domain/exceptions/custom'
import { IUserRepository } from '../../domain/repositories/users'
import { IJwtManager } from '../../domain/utils/jwt'
import { IPasswordManager } from '../../domain/utils/password'
import Logger from '../../infraestructure/config/logger'

export class AuthService {
    private userRepository: IUserRepository
    private passwordManager: IPasswordManager
    private jwtManager: IJwtManager

    constructor(
        userRepository: IUserRepository,
        passwordManager: IPasswordManager,
        jwtManager: IJwtManager
    ) {
        this.userRepository = userRepository
        this.passwordManager = passwordManager
        this.jwtManager = jwtManager
    }

    public async getUserByEmail(email: string) {
        const user = await this.userRepository.findByEmail(email)
        if (!user) {
            throw new ApiError('User not found', 404)
        }
        return user
    }

    public async verifyPassword(
        storedPassword: string,
        providedPassword: string
    ) {
        const isValidPassword = this.passwordManager.verifyPassword(
            storedPassword,
            providedPassword
        )
        if (!isValidPassword) {
            throw new ApiError('Invalid password', 400)
        }
        return isValidPassword
    }

    public async validateEmail(email: string) {
        if (!email.includes('@')) {
            throw new ApiError('Invalid email', 400)
        }
    }

    public async generateJwt(
        userId: number,
        userEmail: string,
        userName: string
    ) {
        const token = this.jwtManager.sign({ userId, userEmail, userName })
        return token
    }

    public async login(email: string, password: string) {
        await this.validateEmail(email)
        const user = await this.getUserByEmail(email)
        await this.verifyPassword(user.password, password)
        const token = await this.generateJwt(
            user.id as number,
            user.email,
            user.name
        )
        return { accessToken: token }
    }

    public async verifyHeader(req: http.IncomingMessage) {
        const header = req.headers['authorization']
        if (!header) {
            Logger.info('No authorization header')
            throw new ApiError('Unauthorized', 401)
        }
        const type = header.split(' ')[0]
        const token = header.split(' ')[1]
        if (type !== 'Bearer') {
            Logger.info(`Invalid token type ${type}`)
            throw new ApiError('Unauthorized', 401)
        }
        await this.verifyJwt(token)
    }

    public async verifyJwt(token: string) {
        try {
            const decoded = this.jwtManager.verify(token)
            return decoded
        } catch (error) {
            Logger.info(`Error verifying token ${error}`)
            throw new ApiError('Unauthorized', 401)
        }
    }
}
