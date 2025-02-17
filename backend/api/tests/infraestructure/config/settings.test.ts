describe('Configuration Settings', () => {
    const originalEnv = process.env

    beforeEach(() => {
        jest.resetModules()
    })

    afterEach(() => {
        process.env = originalEnv
    })

    it('should load environment variables', () => {
        process.env.DB_USER = 'testUser'
        process.env.DB_PASSWORD = 'testPassword'
        process.env.DB_HOST = 'testHost'
        process.env.DB_PORT = '1234'
        process.env.DB_NAME = 'testDB'
        process.env.JWT_SECRET = 'testSecret'
        process.env.JWT_EXPIRATION = '7200'

        const {
            settings: testSettings
        } = require('../../../src/infraestructure/config/settings')

        expect(testSettings.DB_USER).toBe('testUser')
        expect(testSettings.DB_PASSWORD).toBe('testPassword')
        expect(testSettings.DB_HOST).toBe('testHost')
        expect(testSettings.DB_PORT).toBe(1234)
        expect(testSettings.DB_NAME).toBe('testDB')
        expect(testSettings.JWT_SECRET).toBe('testSecret')
        expect(testSettings.JWT_EXPIRATION).toBe('7200')
    })

    it('should use default values when env variables are not set', () => {
        const {
            settings: defaultSettings
        } = require('../../../src/infraestructure/config/settings')

        expect(defaultSettings.DB_USER).toBe('testUser')
        expect(defaultSettings.DB_PASSWORD).toBe('testPassword')
        expect(defaultSettings.DB_HOST).toBe('testHost')
        expect(defaultSettings.DB_PORT).toBe(1234)
        expect(defaultSettings.DB_NAME).toBe('testDB')
        expect(defaultSettings.JWT_SECRET).toBe('testSecret')
        expect(defaultSettings.JWT_EXPIRATION).toBe('7200')
    })
})
