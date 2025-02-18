import { HttpResponse, HttpRequest } from '../../../../../src/app';
import { listAllBuysController } from '../../../../../src/infraestructure/adapters/input/api/buys';
import { db } from '../../../../../src/infraestructure/adapters/output/database/index';
import { getAuthService, getBuysService } from '../../../../../src/infraestructure/dependencies/services';
import { BuyFilterValidator } from '../../../../../src/domain/filters/buys';

jest.mock('../../../../../src/infraestructure/adapters/output/database/index', () => ({
    db: {
        connect: jest.fn(),
    },
}));

jest.mock('../../../../../src/infraestructure/dependencies/services', () => ({
    getAuthService: jest.fn(),
    getBuysService: jest.fn(),
}));

jest.mock('../../../../../src/domain/filters/buys', () => ({
    BuyFilterValidator: {
        validate: jest.fn(),
    },
}));

jest.mock('../../../../../src/infraestructure/config/logger');

describe('listAllBuysController', () => {
    let req: HttpRequest;
    let res: HttpResponse;
    let mockClient: any;

    beforeEach(() => {
        req = {
            query: {},
        } as HttpRequest;

        res = {
            statusCode: 0,
            end: jest.fn(),
        } as any;

        mockClient = {
            release: jest.fn(),
        };

        (db.connect as jest.Mock).mockResolvedValue(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should list all buys successfully', async () => {
        const mockAuthService = {
            verifyHeader: jest.fn(),
        };
        const mockBuysService = {
            listAllBuys: jest.fn().mockResolvedValue({ data: [], page: 1, perPage: 10, total: 0 }),
        };

        (getAuthService as jest.Mock).mockResolvedValue(mockAuthService);
        (getBuysService as jest.Mock).mockResolvedValue(mockBuysService);
        (BuyFilterValidator.validate as jest.Mock).mockReturnValue({});

        await listAllBuysController(req, res);

        expect(db.connect).toHaveBeenCalled();
        expect(mockAuthService.verifyHeader).toHaveBeenCalledWith(req);
        expect(BuyFilterValidator.validate).toHaveBeenCalledWith(req.query);
        expect(getBuysService).toHaveBeenCalledWith(mockClient);
        expect(mockBuysService.listAllBuys).toHaveBeenCalledWith({});
        expect(mockClient.release).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ data: [], page: 1, perPage: 10, total: 0 }));
    });

    it('should handle errors', async () => {
        const mockAuthService = {
            verifyHeader: jest.fn().mockRejectedValue(new Error('Unauthorized')),
        };
        const mockBuysService = {
            listAllBuys: jest.fn(),
        };

        (getAuthService as jest.Mock).mockResolvedValue(mockAuthService);
        (getBuysService as jest.Mock).mockResolvedValue(mockBuysService);
        (BuyFilterValidator.validate as jest.Mock).mockReturnValue({});

        await expect(listAllBuysController(req, res)).rejects.toThrow('Unauthorized');
    });
});