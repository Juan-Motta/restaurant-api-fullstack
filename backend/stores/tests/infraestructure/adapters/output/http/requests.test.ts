import { HttpAdapter } from '../../../../../src/infraestructure/adapters/output/http/request';

// Mock the fetch function
global.fetch = jest.fn();

describe('HttpAdapter', () => {
    let httpAdapter: HttpAdapter;

    beforeEach(() => {
        httpAdapter = new HttpAdapter();
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should fetch data successfully', async () => {
            const mockUrl = 'https://api.example.com/data';
            const mockResponse = { key: 'value' };

            // Mocking the fetch response
            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await httpAdapter.get(mockUrl);

            expect(fetch).toHaveBeenCalledWith(mockUrl, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                },
            });
            expect(result).toEqual(mockResponse);
        });

        it('should throw an error if response is not ok', async () => {
            const mockUrl = 'https://api.example.com/data';

            (fetch as jest.Mock).mockResolvedValue({
                ok: false,
                json: jest.fn().mockResolvedValue({ error: 'Not Found' }),
            });
        });
    });
});