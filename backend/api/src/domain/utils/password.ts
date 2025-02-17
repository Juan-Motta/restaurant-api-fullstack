export class IPasswordManager {
    public getRandomString(
        length: number = 12,
        allowedChars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    ): string {
        throw new Error('Not implemented')
    }

    public generatePassword(
        password: string,
        iterations: number = 30000
    ): string {
        throw new Error('Not implemented')
    }

    public hashPBKDF2SHA256(password: string, iterations: number): string {
        throw new Error('Not implemented')
    }

    public verifyPassword(
        storedPassword: string,
        providedPassword: string
    ): boolean {
        throw new Error('Not implemented')
    }
}
