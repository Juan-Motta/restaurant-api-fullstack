import { migrate, migrateAll } from '../../../../../src/infraestructure/adapters/output/database/migrations';
import { db } from '../../../../../src/infraestructure/adapters/output/database/index';
import Logger from '../../../../../src/infraestructure/config/logger';

jest.mock('../../../../../src/infraestructure/adapters/output/database/index');
jest.mock('../../../../../src/infraestructure/config/logger');


describe('Migration Tests', () => {
    let mockClient: any;

    beforeEach(() => {
        mockClient = {
            query: jest.fn(),
            release: jest.fn()
        };
        (db.connect as jest.Mock).mockResolvedValue(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('migrate function creates a table if it does not exist', async () => {
        const model = {
            name: 'test_table',
            query: 'CREATE TABLE test_table (id SERIAL PRIMARY KEY, name TEXT);'
        };

        mockClient.query.mockResolvedValueOnce({ rows: [{ exists: false }] });

        await migrate(model);

        expect(mockClient.query).toHaveBeenCalledWith(model.query);
        expect(mockClient.release).toHaveBeenCalled();
    });

    test('migrate function does not create a table if it already exists', async () => {
        const model = {
            name: 'test_table',
            query: 'CREATE TABLE test_table (id SERIAL PRIMARY KEY, name TEXT);'
        };

        mockClient.query.mockResolvedValueOnce({ rows: [{ exists: true }] });

        await migrate(model);

        expect(mockClient.query).not.toHaveBeenCalledWith(model.query);
        expect(mockClient.release).toHaveBeenCalled();
    });
});