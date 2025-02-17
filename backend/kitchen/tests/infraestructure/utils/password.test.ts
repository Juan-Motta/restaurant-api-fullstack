import { PasswordManager } from '../../../src/infraestructure/utils/password'

describe('PasswordManager', () => {
    let passwordManager: PasswordManager

    beforeEach(() => {
        passwordManager = new PasswordManager()
    })

    it('should generate a random string of the specified length', () => {
        const randomString = passwordManager.getRandomString(10)
        expect(randomString).toHaveLength(10)
        expect(randomString).toMatch(/[A-Za-z0-9]{10}/)
    })

    it('should generate a hashed password', () => {
        const password = 'mySecurePassword'
        const hashedPassword = passwordManager.generatePassword(password)
        expect(hashedPassword).toMatch(/pbkdf2_sha256\$\d+\$[A-Za-z0-9]*\$.*/)
    })

    it('should verify a correct password', () => {
        const password = 'mySecurePassword'
        const hashedPassword = passwordManager.generatePassword(password)

        const isVerified = passwordManager.verifyPassword(
            hashedPassword,
            password
        )
        expect(isVerified).toBe(true)
    })

    it('should not verify an incorrect password', () => {
        const password = 'mySecurePassword'
        const hashedPassword = passwordManager.generatePassword(password)

        const isVerified = passwordManager.verifyPassword(
            hashedPassword,
            'wrongPassword'
        )
        expect(isVerified).toBe(false)
    })

    it('should generate a consistent hash for the same password', () => {
        const password = 'mySecurePassword'
        const hashedPassword1 = passwordManager.generatePassword(password)
        const hashedPassword2 = passwordManager.generatePassword(password)

        expect(hashedPassword1).toMatch(/pbkdf2_sha256\$\d+\$[A-Za-z0-9]*\$.*/)
        expect(hashedPassword2).toMatch(/pbkdf2_sha256\$\d+\$[A-Za-z0-9]*\$.*/)
        expect(hashedPassword1).not.toBe(hashedPassword2)
    })
})
