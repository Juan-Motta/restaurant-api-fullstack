import { PoolClient } from 'pg'

import { IUserRepository } from '../../domain/repositories/users'
import { UserRepository } from '../adapters/output/repository/users'

export async function getUserRepository(
    client: PoolClient
): Promise<IUserRepository> {
    return new UserRepository(client)
}
