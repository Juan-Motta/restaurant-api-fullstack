import * as http from 'http'
import { URL } from 'url'
import { migrateAll } from './infraestructure/adapters/output/database/migrations'
import Logger from './infraestructure/config/logger'
import { Route } from './domain/entities/commons'
import { ApiError } from './domain/exceptions/custom'

export interface HttpRequest extends http.IncomingMessage {
    body?: Record<string, any> | null
    params?: Record<string, string>
    query?: Record<string, string>
}

export interface HttpResponse extends http.ServerResponse {}

export class HttpServer {
    private server: http.Server
    private routes: Array<Route<any>> = []

    constructor() {
        this.server = http.createServer(
            (req: HttpRequest, res: http.ServerResponse) => {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.setHeader(
                    'Access-Control-Allow-Methods',
                    'GET, POST, PUT, DELETE, OPTIONS'
                )
                res.setHeader(
                    'Access-Control-Allow-Headers',
                    'Content-Type, Authorization'
                )

                if (req.method === 'OPTIONS') {
                    res.writeHead(204)
                    res.end()
                    return
                }

                const parsedUrl = new URL(
                    req.url || '',
                    `http://${req.headers.host}`
                )
                req.query = Object.fromEntries(parsedUrl.searchParams.entries())

                const route = this.routes.find((r) => {
                    const match = this.matchRoute(
                        r.path,
                        parsedUrl.pathname || ''
                    )
                    if (match) {
                        req.params = match.params
                        return r.method === req.method
                    }
                    return false
                })

                let buffer: Buffer[] = []
                req.on('data', (chunk: Buffer) => {
                    buffer.push(chunk)
                }).on('end', async () => {
                    const body = Buffer.concat(buffer).toString()
                    req.body = body ? JSON.parse(body) : null
                    res.setHeader('Content-Type', 'application/json')
                    if (route) {
                        try {
                            await route.handler(req, res)
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
        handler: (req: HttpRequest, res: HttpResponse) => void
    ) {
        this.routes.push({ path, method, handler })
    }

    private matchRoute(routePath: string, url: string) {
        const routeRegex = this.pathToRegex(routePath)
        const match = routeRegex.exec(url)
        if (match) {
            const keys = routePath.match(/:[^/]+/g) || []
            const params: Record<string, string> = {}
            keys.forEach((key, index) => {
                const paramName = key.slice(1)
                params[paramName] = match[index + 1]
            })
            return { params }
        }
        return null
    }

    private pathToRegex(path: string) {
        const regexPath = path.replace(/:\w+/g, '([^/]+)')
        return new RegExp(`^${regexPath}$`)
    }
}
