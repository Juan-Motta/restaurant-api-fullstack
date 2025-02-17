export class IEventsLogsRepository {
    async create(event: string, message: Record<string, any>, state: string, error: string | null | undefined): Promise<void> {
        throw new Error('Method not implemented.')
    }
}