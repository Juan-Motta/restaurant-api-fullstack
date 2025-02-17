class Logger {
    private static formatDate(date: Date): string {
        return date.toTimeString().split(' ')[0]
    }

    public static log(level: string, message: string): void {
        const timestamp = this.formatDate(new Date())
        console.log(`[${level}] ${timestamp} ${message}`)
    }

    public static info(message: string): void {
        this.log('INFO', message)
    }

    public static warning(message: string): void {
        this.log('WARNING', message)
    }

    public static error(message: string): void {
        this.log('ERROR', message)
    }
}

export default Logger
