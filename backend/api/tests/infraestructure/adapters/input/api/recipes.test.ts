import { db } from '../../../../../src/infraestructure/adapters/output/database/index'
import Logger from '../../../../../src/infraestructure/config/logger'
import {
    getRecipeController,
    listAllRecipesController
} from '../../../../../src/infraestructure/adapters/input/api/recipes'
import {
    getRecipesService,
    getAuthService
} from '../../../../../src/infraestructure/dependencies/services'
import { HttpRequest, HttpResponse } from '../../../../../src/app'
import { RecipeFilterValidator } from '../../../../../src/domain/filters/recipes'

jest.mock(
    '../../../../../src/infraestructure/adapters/output/database/index',
    () => ({
        db: {
            connect: jest.fn()
        }
    })
)

jest.mock('../../../../../src/infraestructure/dependencies/services', () => ({
    getRecipesService: jest.fn(),
    getAuthService: jest.fn()
}))

jest.mock('../../../../../src/domain/filters/recipes', () => ({
    RecipeFilterValidator: {
        validate: jest.fn()
    }
}))

jest.mock('../../../../../src/infraestructure/config/logger')

describe('Recipes Controllers', () => {
    let req: HttpRequest
    let res: HttpResponse
    let mockClient: any

    beforeEach(() => {
        req = {
            query: {},
            params: {}
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

    describe('getRecipeController', () => {
        it('should retrieve a recipe by id successfully', async () => {
            const mockAuthService = {
                verifyHeader: jest.fn()
            }
            const mockRecipesService = {
                getRecipeById: jest
                    .fn()
                    .mockResolvedValue({
                        id: 1,
                        name: 'Pasta',
                        ingredients: []
                    })
            }

            ;(req.params as Record<string, string>).id = '1'

            ;(getAuthService as jest.Mock).mockResolvedValue(mockAuthService)
            ;(getRecipesService as jest.Mock).mockResolvedValue(
                mockRecipesService
            )

            await getRecipeController(req, res)

            expect(db.connect).toHaveBeenCalled()
            expect(mockAuthService.verifyHeader).toHaveBeenCalledWith(req)
            expect(getRecipesService).toHaveBeenCalledWith(mockClient)
            expect(mockRecipesService.getRecipeById).toHaveBeenCalledWith(1)
            expect(mockClient.release).toHaveBeenCalled()
            expect(res.statusCode).toBe(200)
            expect(res.end).toHaveBeenCalledWith(
                JSON.stringify({ id: 1, name: 'Pasta', ingredients: [] })
            )
        })

        it('should return error for missing id parameter', async () => {
            const mockAuthService = {
                verifyHeader: jest.fn()
            }

            ;(getAuthService as jest.Mock).mockResolvedValue(mockAuthService)

            await getRecipeController(req, res)

            expect(res.statusCode).toBe(400)
            expect(res.end).toHaveBeenCalledWith(
                JSON.stringify({ message: 'Missing id parameter' })
            )
        })

        it('should return error for invalid id parameter', async () => {
            ;(req.params as Record<string, string>).id = 'abc'

            const mockAuthService = {
                verifyHeader: jest.fn()
            }

            ;(getAuthService as jest.Mock).mockResolvedValue(mockAuthService)

            await getRecipeController(req, res)

            expect(res.statusCode).toBe(400)
            expect(res.end).toHaveBeenCalledWith(
                JSON.stringify({ message: 'Invalid id parameter' })
            )
        })
    })

    describe('listAllRecipesController', () => {
        it('should list all recipes successfully', async () => {
            const mockAuthService = {
                verifyHeader: jest.fn()
            }
            const mockRecipesService = {
                listAllRecipes: jest.fn().mockResolvedValue([
                    { id: 1, name: 'Pasta' },
                    { id: 2, name: 'Pizza' }
                ])
            }
            const mockFilters = { page: 1, perPage: 10 }

            ;(RecipeFilterValidator.validate as jest.Mock).mockReturnValue(
                mockFilters
            )

            ;(getAuthService as jest.Mock).mockResolvedValue(mockAuthService)
            ;(getRecipesService as jest.Mock).mockResolvedValue(
                mockRecipesService
            )

            await listAllRecipesController(req, res)

            expect(db.connect).toHaveBeenCalled()
            expect(mockAuthService.verifyHeader).toHaveBeenCalledWith(req)
            expect(RecipeFilterValidator.validate).toHaveBeenCalledWith(
                req.query
            )
            expect(getRecipesService).toHaveBeenCalledWith(mockClient)
            expect(mockRecipesService.listAllRecipes).toHaveBeenCalledWith(
                mockFilters
            )
            expect(mockClient.release).toHaveBeenCalled()
            expect(res.statusCode).toBe(200)
            expect(res.end).toHaveBeenCalledWith(
                JSON.stringify([
                    { id: 1, name: 'Pasta' },
                    { id: 2, name: 'Pizza' }
                ])
            )
        })
    })
})
