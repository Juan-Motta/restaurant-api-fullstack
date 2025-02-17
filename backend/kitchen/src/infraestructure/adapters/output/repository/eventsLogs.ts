import { PoolClient } from 'pg'
import { IEventsLogsRepository } from '../../../../domain/repositories/eventsLogs'

export class EventsLogsRepository implements IEventsLogsRepository {
    private client: PoolClient

    constructor(client: PoolClient) {
        this.client = client
    }

    async create(event: string, message: Record<string, any>, state: string, error: string | null | undefined): Promise<void> {
        await this.client.query(`
            INSERT INTO event_logs (event, message, state, error) VALUES ($1, $2, $3, $4);
        `, [event, message, state, error || null])
    }
}