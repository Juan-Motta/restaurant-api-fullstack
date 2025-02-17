import * as http from 'http'

export interface Body {}

export interface Route<T> {
    path: string
    method: string
    handler: (
        req: http.IncomingMessage,
        res: http.ServerResponse,
    ) => void
}
