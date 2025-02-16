import { PoolClient } from 'pg'
import { IUserRepository } from '../../../src/domain/repositories/users'
import { getUserRepository } from '../../../src/infraestructure/dependencies/repositories'
import { UserRepository } from '../../../src/infraestructure/adapters/output/repository/users'

jest.mock('../../../src/infraestructure/adapters/output/repository/users')

describe('getUserRepository', () => {
    let mockClient: PoolClient

    beforeEach(() => {
        mockClient = {} as PoolClient
    })

    it('should return an instance of IUserRepository', async () => {
        ;(UserRepository as jest.Mock).mockImplementation(() => {
            return this
        })

        const userRepository: IUserRepository =
            await getUserRepository(mockClient)

        expect(userRepository).toBeInstanceOf(UserRepository)
    })
})
