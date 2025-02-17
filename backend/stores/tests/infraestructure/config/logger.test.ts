import Logger from '../../../src/infraestructure/config/logger'

describe('Logger', () => {
    const originalConsoleLog = console.log

    beforeEach(() => {
        console.log = jest.fn()
    })

    afterEach(() => {
        console.log = originalConsoleLog
    })

    it('should log info messages correctly', () => {
        const message = 'This is an info message'
        Logger.info(message)

        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(
                /^\[INFO\] \d{2}:\d{2}:\d{2} This is an info message$/
            )
        )
    })

    it('should log warning messages correctly', () => {
        const message = 'This is a warning message'
        Logger.warning(message)

        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(
                /^\[WARNING\] \d{2}:\d{2}:\d{2} This is a warning message$/
            )
        )
    })

    it('should log error messages correctly', () => {
        const message = 'This is an error message'
        Logger.error(message)

        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(
                /^\[ERROR\] \d{2}:\d{2}:\d{2} This is an error message$/
            )
        )
    })
})
