// healthCheckController.test.ts
import { healthCheckController } from '../../../../../src/infraestructure/adapters/input/api/common';
import { HttpRequest, HttpResponse } from '../../../../../src/app';
import Logger from '../../../../../src/infraestructure/config/logger';

jest.mock('../../../../../src/infraestructure/config/logger');

describe('Health Check Controller', () => {
    let req: HttpRequest;
    let res: HttpResponse;

    beforeEach(() => {
        req = {
            aborted: false,
            httpVersion: '1.1',
            httpVersionMajor: 1,
            httpVersionMinor: 1,
            complete: true,
            headers: {},
            rawHeaders: [],
            trailers: {},
            rawTrailers: [],
            setTimeout: jest.fn(),
            statusCode: 200,
            statusMessage: 'OK',
            socket: {} as any,
            method: 'GET',
            url: '/',
        } as unknown as HttpRequest;
        res = {
            statusCode: 0,
            end: jest.fn(),
        } as unknown as HttpResponse;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should log health check and send status 200 with correct body', async () => {
        await healthCheckController(req, res);

        expect(res.statusCode).toBe(200);

        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ status: 'ok' }));
    });
});