import { AuthService } from '../../application/services/auth'
import { UserService } from '../../application/services/user'
import { UserRepository } from '../adapters/output/repository/users'
import { PasswordManager } from '../utils/password'
import { PoolClient } from 'pg'
import { JwtManager } from '../utils/jwt'

export async function getUserService(client: PoolClient) {
    const userRepository = new UserRepository(client)
    const passwordManager = new PasswordManager()
    return new UserService(userRepository, passwordManager)
}

export async function getAuthService(client: PoolClient) {
    const userRepository = new UserRepository(client)
    const passwordManager = new PasswordManager()
    const jwtManager = new JwtManager()
    return new AuthService(userRepository, passwordManager, jwtManager)
}
