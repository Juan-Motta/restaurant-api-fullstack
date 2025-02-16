import * as http from 'http'
import { migrateAll } from './infraestructure/adapters/output/database/migrations'
import Logger from './infraestructure/config/logger'
import { Route } from './domain/entities/commons'
import { ApiError } from './domain/exceptions/custom'

export class HttpServer {
    private server: http.Server
    private routes: Array<Route<any>> = []

    constructor() {
        this.server = http.createServer(
            (req: http.IncomingMessage, res: http.ServerResponse) => {
                const route = this.routes.find(
                    (r) => r.path === req.url && r.method === req.method
                )
                let buffer: Buffer[] = []
                req.on('data', (chunk: Buffer) => {
                    buffer.push(chunk)
                }).on('end', async () => {
                    const body = Buffer.concat(buffer).toString()
                    res.setHeader('Content-Type', 'application/json')
                    if (route) {
                        try {
                            await route.handler(req, res, JSON.parse(body))
                            Logger.info(
                                `${req.method} ${req.url} ${res.statusCode}`
                            )
                        } catch (error) {
                            const errorMessage =
                                error instanceof Error
                                    ? error.message
                                    : String(error)
                            const stackTraceArray =
                                error instanceof Error
                                    ? error.stack
                                          ?.split('\n')
                                          .map((line) => line.trim())
                                    : []
                            if (error instanceof ApiError) {
                                res.statusCode = error.statusCode
                                res.end(
                                    JSON.stringify({ message: errorMessage })
                                )
                            } else {
                                res.statusCode = 500
                                res.end(
                                    JSON.stringify({
                                        message: errorMessage,
                                        stack: stackTraceArray
                                    })
                                )
                            }
                            Logger.info(
                                `${req.method} ${req.url} ${res.statusCode}`
                            )
                        }
                    } else {
                        res.statusCode = 404
                        res.end(JSON.stringify({ message: 'Not found' }))
                        Logger.info(
                            `${req.method} ${req.url} ${res.statusCode}`
                        )
                    }
                })
            }
        )
    }

    public listen(port: number) {
        this.server.listen(port, async () => {
            await migrateAll()
            Logger.info(`Server is running on port ${port}`)
        })
    }

    public addRoute(
        path: string,
        method: string,
        handler: (
            req: http.IncomingMessage,
            res: http.ServerResponse,
            body: any
        ) => void
    ) {
        this.routes.push({ path, method, handler })
    }
}
