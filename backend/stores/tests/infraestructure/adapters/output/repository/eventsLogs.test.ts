import { PoolClient } from 'pg'
import { EventsLogsRepository } from '../../../../../src/infraestructure/adapters/output/repository/eventsLogs'

describe('EventsLogsRepository', () => {
    let client: PoolClient
    let eventsLogsRepository: EventsLogsRepository

    beforeEach(() => {
        client = {
            query: jest.fn()
        } as unknown as PoolClient
        eventsLogsRepository = new EventsLogsRepository(client)
    })

    describe('create', () => {
        it('should insert an event log into the database', async () => {
            const event = 'User Registered'
            const message = { userId: 1, username: 'testuser' }
            const state = 'CREATED'
            const error = null

            client.query = jest.fn().mockResolvedValue(undefined)

            await eventsLogsRepository.create(event, message, state, error)

            expect(client.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO event_logs'),
                [event, message, state, null]
            )
        })

        it('should handle the error parameter correctly', async () => {
            const event = 'User Registration Failed'
            const message = { userId: 2, username: 'faileduser' }
            const state = 'FAILED'
            const error = 'Email already in use'

            client.query = jest.fn().mockResolvedValue(undefined)

            await eventsLogsRepository.create(event, message, state, error)

            expect(client.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO event_logs'),
                [event, message, state, error]
            )
        })

        it('should insert without an error message when the error parameter is null', async () => {
            const event = 'User Registration Attempt'
            const message = { userId: 3, username: 'testuser' }
            const state = 'PENDING'
            const error = null

            client.query = jest.fn().mockResolvedValue(undefined)

            await eventsLogsRepository.create(event, message, state, error)

            expect(client.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO event_logs'),
                [event, message, state, null]
            )
        })
    })
})
