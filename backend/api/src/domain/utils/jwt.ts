export class IJwtManager {
    public sign(payload: object): string {
        throw new Error('Not implemented')
    }

    public verify(token: string) {
        throw new Error('Not implemented')
    }
}
