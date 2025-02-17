import { PoolClient } from 'pg'

import { User } from '../../../../domain/entities/users'
import { IUserRepository } from '../../../../domain/repositories/users'

export class UserRepository implements IUserRepository {
    private client: PoolClient

    constructor(client: PoolClient) {
        this.client = client
    }

    async create(user: User): Promise<User> {
        const res = await this.client.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [user.name, user.email, user.password]
        )
        return {
            id: parseInt(res.rows[0].id),
            name: res.rows[0].name,
            email: res.rows[0].email,
            password: res.rows[0].password,
            createdAt: res.rows[0].created_at
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        const res = await this.client.query(
            'SELECT * FROM users u WHERE u.email = $1',
            [email]
        )
        if (res.rows.length === 0) {
            return null
        }
        return {
            id: parseInt(res.rows[0].id),
            name: res.rows[0].name,
            email: res.rows[0].email,
            password: res.rows[0].password,
            createdAt: res.rows[0].created_at
        }
    }
}
