export class IHttpAdapter {
    public async get<T>(url: string): Promise<T> {
        throw new Error('Method not implemented.')
    }
}
