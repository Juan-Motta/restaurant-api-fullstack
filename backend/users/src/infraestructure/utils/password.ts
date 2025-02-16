import { pbkdf2Sync } from 'crypto'
import { IPasswordManager } from '../../domain/utils/password'

export class PasswordManager implements IPasswordManager {
    public getRandomString(
        length: number = 12,
        allowedChars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    ): string {
        return Array.from({ length }, () =>
            allowedChars.charAt(Math.floor(Math.random() * allowedChars.length))
        ).join('')
    }

    public generatePassword(
        password: string,
        iterations: number = 30000
    ): string {
        return this.hashPBKDF2SHA256(password, iterations)
    }

    public hashPBKDF2SHA256(password: string, iterations: number): string {
        const salt = this.getRandomString()
        const saltBuffer = Buffer.from(salt, 'utf-8')
        const hash = pbkdf2Sync(password, saltBuffer, iterations, 32, 'sha256')
        const hashBase64 = hash.toString('base64')

        return `pbkdf2_sha256$${iterations}$${salt}$${hashBase64}`
    }

    public verifyPassword(
        storedPassword: string,
        providedPassword: string
    ): boolean {
        const [_, iterationsStr, salt, hashBase64] = storedPassword.split('$')
        const iterations = parseInt(iterationsStr, 10)

        const saltBuffer = Buffer.from(salt, 'utf-8')
        const pwdHash = pbkdf2Sync(
            providedPassword,
            saltBuffer,
            iterations,
            32,
            'sha256'
        )

        return pwdHash.toString('base64') === hashBase64
    }
}
