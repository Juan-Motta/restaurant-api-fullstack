import { migrate } from '../../../../../src/infraestructure/adapters/output/database/migrations'
import { db } from '../../../../../src/infraestructure/adapters/output/database/index'
import { UsersModel } from '../../../../../src/infraestructure/adapters/output/database/models'

jest.mock(
    '../../../../../src/infraestructure/adapters/output/database/index',
    () => ({
        db: {
            connect: jest.fn()
        }
    })
)

jest.mock('../../../../../src/infraestructure/config/logger')
jest.mock(
    '../../../../../src/infraestructure/adapters/output/database/models',
    () => ({
        UsersModel: {
            name: 'users',
            query: 'CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100));'
        }
    })
)

describe('Database Migration', () => {
    let mockClient: any

    beforeEach(() => {
        mockClient = {
            query: jest.fn(),
            release: jest.fn()
        }
        ;(db.connect as jest.Mock).mockResolvedValue(mockClient)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('migrate', () => {
        it('should create the table when it does not exist', async () => {
            mockClient.query.mockResolvedValueOnce({
                rows: [{ exists: false }]
            })

            await migrate(UsersModel)

            expect(mockClient.query).toHaveBeenCalledWith(UsersModel.query)
            expect(mockClient.release).toHaveBeenCalledTimes(1)
        })

        it('should not create the table when it already exists', async () => {
            mockClient.query.mockResolvedValueOnce({ rows: [{ exists: true }] })

            await migrate(UsersModel)

            expect(mockClient.query).not.toHaveBeenCalledWith(UsersModel.query)
            expect(mockClient.release).toHaveBeenCalledTimes(1)
        })
    })
})
