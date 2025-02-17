import { User } from '../../domain/entities/users'

export class IUserRepository {
    async create(user: User): Promise<User> {
        throw new Error('Not implemented')
    }

    async findByEmail(email: string): Promise<User | null> {
        throw new Error('Not implemented')
    }
}
