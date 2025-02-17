import { IHttpAdapter } from "../../../../domain/adapters/http"

export class HttpAdapter implements IHttpAdapter {
    public async get<T>(url: string): Promise<T> {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        })
        const data = await response.json()
        return data
    }
}