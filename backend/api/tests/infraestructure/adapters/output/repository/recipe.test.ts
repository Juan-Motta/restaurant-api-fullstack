import { PoolClient } from 'pg'
import { RecipeRepository } from '../../../../../src/infraestructure/adapters/output/repository/recipes'
import { RecipeFilter } from '../../../../../src/domain/filters/recipes'

describe('RecipeRepository', () => {
    let client: PoolClient
    let recipeRepository: RecipeRepository

    beforeEach(() => {
        client = {
            query: jest.fn()
        } as unknown as PoolClient
        recipeRepository = new RecipeRepository(client)
    })

    describe('countAll', () => {
        it('should return the count of all recipes', async () => {
            const mockCountResult = { rows: [{ count: '10' }] }
            client.query = jest.fn().mockResolvedValue(mockCountResult)

            const result = await recipeRepository.countAll()

            expect(result).toBe(10)
            expect(client.query).toHaveBeenCalledWith(
                'SELECT COUNT(*) FROM recipes'
            )
        })
    })

    describe('getRandomRecipe', () => {
        it('should return a random recipe', async () => {
            const mockRecipe = { id: '1', name: 'Pasta' }
            const mockQueryResult = { rows: [mockRecipe] }
            client.query = jest.fn().mockResolvedValue(mockQueryResult)

            const result = await recipeRepository.getRandomRecipe()

            expect(result).toEqual({
                id: 1,
                name: mockRecipe.name
            })
            expect(client.query).toHaveBeenCalledWith(
                `SELECT * FROM recipes ORDER BY RANDOM() LIMIT 1`
            )
        })
    })

    describe('getRecipeById', () => {
        it('should return a recipe with its ingredients', async () => {
            const mockQueryResult = {
                rows: [
                    {
                        recipeid: '1',
                        recipename: 'Pasta',
                        ingredientid: '1',
                        ingredientname: 'Flour',
                        ingredientquantity: 500
                    },
                    {
                        recipeid: '1',
                        recipename: 'Pasta',
                        ingredientid: '2',
                        ingredientname: 'Water',
                        ingredientquantity: 200
                    }
                ]
            }
            client.query = jest.fn().mockResolvedValue(mockQueryResult)

            const result = await recipeRepository.getRecipeById(1)

            expect(result).toEqual({
                id: 1,
                name: 'Pasta',
                ingredients: [
                    { id: 1, name: 'Flour', quantity: 500 },
                    { id: 2, name: 'Water', quantity: 200 }
                ]
            })
            expect(client.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE r.id = $1'),
                [1]
            )
        })

        it('should return null if no recipe is found', async () => {
            const mockQueryResult = { rows: [] }
            client.query = jest.fn().mockResolvedValue(mockQueryResult)

            const result = await recipeRepository.getRecipeById(99)

            expect(result).toBeNull()
        })
    })

    describe('listAllRecipes', () => {
        it('should return all recipes based on filters', async () => {
            const filters: RecipeFilter = { page: 1, perPage: 10 }
            const mockData = [
                { id: '1', name: 'Pasta' },
                { id: '2', name: 'Pizza' }
            ]
            const mockQueryResult = { rows: mockData }

            client.query = jest.fn().mockResolvedValue(mockQueryResult)

            const result = await recipeRepository.listAllRecipes(filters)

            expect(result).toEqual([
                { id: 1, name: 'Pasta' },
                { id: 2, name: 'Pizza' }
            ])
            expect(client.query).toHaveBeenCalled()
        })

        it('should build the correct SQL query with filters', async () => {
            const filters: RecipeFilter = {
                recipeId: 1,
                recipeName: 'Pasta',
                page: 1,
                perPage: 10
            }

            const mockQueryResult = { rows: [] }
            client.query = jest.fn().mockResolvedValue(mockQueryResult)

            await recipeRepository.listAllRecipes(filters)

            expect(client.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE'),
                [filters.recipeId, filters.recipeName, filters.perPage, 0]
            )
        })

        it('should return an empty array when no recipes match the filters', async () => {
            const filters: RecipeFilter = {
                recipeId: 999,
                page: 1,
                perPage: 10
            }
            const mockQueryResult = { rows: [] }
            client.query = jest.fn().mockResolvedValue(mockQueryResult)

            const result = await recipeRepository.listAllRecipes(filters)

            expect(result).toEqual([])
        })
    })
})
