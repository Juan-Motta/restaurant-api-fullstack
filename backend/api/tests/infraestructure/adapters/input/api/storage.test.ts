import { db } from '../../../../../src/infraestructure/adapters/output/database/index'
import Logger from '../../../../../src/infraestructure/config/logger'
import { listAllIngredients } from '../../../../../src/infraestructure/adapters/input/api/storage'
import {
    getStorageService,
    getAuthService
} from '../../../../../src/infraestructure/dependencies/services'
import { HttpRequest, HttpResponse } from '../../../../../src/app'
import { IngredientFilterValidator } from '../../../../../src/domain/filters/ingredients'

jest.mock(
    '../../../../../src/infraestructure/adapters/output/database/index',
    () => ({
        db: {
            connect: jest.fn()
        }
    })
)

jest.mock('../../../../../src/infraestructure/dependencies/services', () => ({
    getStorageService: jest.fn(),
    getAuthService: jest.fn()
}))

jest.mock('../../../../../src/domain/filters/ingredients', () => ({
    IngredientFilterValidator: {
        validate: jest.fn()
    }
}))

jest.mock('../../../../../src/infraestructure/config/logger')

describe('Ingredients Controller', () => {
    let req: HttpRequest
    let res: HttpResponse
    let mockClient: any

    beforeEach(() => {
        req = {
            query: {}
        } as HttpRequest

        res = {
            statusCode: 0,
            end: jest.fn()
        } as any

        mockClient = {
            release: jest.fn()
        }

        ;(db.connect as jest.Mock).mockResolvedValue(mockClient)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('listAllIngredients', () => {
        it('should list all ingredients successfully', async () => {
            const mockAuthService = {
                verifyHeader: jest.fn()
            }
            const mockStorageService = {
                getAllIngredients: jest
                    .fn()
                    .mockResolvedValue([
                        { id: 1, name: 'Sugar', quantity: 100 }
                    ])
            }

            const mockFilters = { page: 1, perPage: 10 }
            ;(IngredientFilterValidator.validate as jest.Mock).mockReturnValue(
                mockFilters
            )

            ;(getAuthService as jest.Mock).mockResolvedValue(mockAuthService)
            ;(getStorageService as jest.Mock).mockResolvedValue(
                mockStorageService
            )

            await listAllIngredients(req, res)

            expect(db.connect).toHaveBeenCalled()
            expect(mockAuthService.verifyHeader).toHaveBeenCalledWith(req)
            expect(IngredientFilterValidator.validate).toHaveBeenCalledWith(
                req.query
            )
            expect(getStorageService).toHaveBeenCalledWith(mockClient)
            expect(mockStorageService.getAllIngredients).toHaveBeenCalledWith(
                mockFilters
            )
            expect(mockClient.release).toHaveBeenCalled()
            expect(res.statusCode).toBe(200)
            expect(res.end).toHaveBeenCalledWith(
                JSON.stringify([{ id: 1, name: 'Sugar', quantity: 100 }])
            )
        })
    })
})
