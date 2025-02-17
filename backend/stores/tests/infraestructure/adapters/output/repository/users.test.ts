import { PoolClient, QueryResult } from 'pg'
import { UserRepository } from '../../../../../src/infraestructure/adapters/output/repository/orders'
import { User } from '../../../../../src/domain/entities/recipes'

describe('UserRepository', () => {
    let mockClient: jest.Mocked<PoolClient>
    let userRepository: UserRepository

    beforeEach(() => {
        mockClient = {
            query: jest.fn() as jest.MockedFunction<
                (queryText: string, values?: any[]) => Promise<QueryResult<any>>
            >,
            release: jest.fn()
        } as unknown as jest.Mocked<PoolClient>
        userRepository = new UserRepository(mockClient)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('create', () => {
        it('should create a user and return the created user', async () => {
            const userInput: User = {
                id: 0,
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'hashed_password',
                createdAt: undefined
            }

            const expectedResponse = {
                id: 1,
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'hashed_password',
                createdAt: undefined
            }

            const mockQueryResult: QueryResult<any> = {
                rows: [expectedResponse],
                command: 'INSERT',
                rowCount: 1,
                oid: 0,
                fields: []
            }

            ;(mockClient.query as jest.Mock).mockResolvedValueOnce(
                mockQueryResult
            )

            const result = await userRepository.create(userInput)

            expect(mockClient.query).toHaveBeenCalledWith(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
                [userInput.name, userInput.email, userInput.password]
            )
            expect(result).toEqual(expectedResponse)
        })
    })

    describe('findByEmail', () => {
        it('should find a user by email and return the user', async () => {
            const email = 'john.doe@example.com'
            const expectedUser = {
                id: 1,
                name: 'John Doe',
                email,
                password: 'hashed_password',
                createdAt: undefined
            }

            const mockQueryResult: QueryResult<any> = {
                rows: [expectedUser],
                command: 'SELECT',
                rowCount: 1,
                oid: 0,
                fields: []
            }

            ;(mockClient.query as jest.Mock).mockResolvedValueOnce(
                mockQueryResult
            )

            const result = await userRepository.findByEmail(email)

            expect(mockClient.query).toHaveBeenCalledWith(
                'SELECT * FROM users u WHERE u.email = $1',
                [email]
            )
            expect(result).toEqual(expectedUser)
        })

        it('should return null if no user is found', async () => {
            const email = 'non.existent@example.com'
            const mockQueryResult: QueryResult<any> = {
                rows: [],
                command: 'SELECT',
                rowCount: 0,
                oid: 0,
                fields: []
            }

            ;(mockClient.query as jest.Mock).mockResolvedValueOnce(
                mockQueryResult
            )

            const result = await userRepository.findByEmail(email)

            expect(mockClient.query).toHaveBeenCalledWith(
                'SELECT * FROM users u WHERE u.email = $1',
                [email]
            )
            expect(result).toBeNull()
        })
    })
})
