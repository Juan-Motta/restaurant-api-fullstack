import { db } from '../../output/database'
import Logger from '../../../config/logger'
import {
    getRecipesService,
    getAuthService
} from '../../../dependencies/services'

import { HttpRequest, HttpResponse } from '../../../../app'
import { RecipeFilterValidator } from '../../../../domain/filters/recipes'

export async function getRecipeController(req: HttpRequest, res: HttpResponse) {
    Logger.info('Get recipe by id')
    const client = await db.connect()

    const authService = await getAuthService(client)
    await authService.verifyHeader(req)

    if (!req.params?.id) {
        res.statusCode = 400
        res.end(JSON.stringify({ message: 'Missing id parameter' }))
        return
    }

    const id = parseInt(req.params?.id)

    if (isNaN(id)) {
        res.statusCode = 400
        res.end(JSON.stringify({ message: 'Invalid id parameter' }))
        return
    }

    const recipeService = await getRecipesService(client)
    const response = await recipeService.getRecipeById(id)

    client.release()
    res.statusCode = 200
    res.end(JSON.stringify(response))
}

export async function listAllRecipesController(
    req: HttpRequest,
    res: HttpResponse
) {
    Logger.info('List all recipes')
    const client = await db.connect()

    const authService = await getAuthService(client)
    await authService.verifyHeader(req)

    const filters = RecipeFilterValidator.validate(req.query)

    const recipeService = await getRecipesService(client)
    const response = await recipeService.listAllRecipes(filters)

    client.release()
    res.statusCode = 200
    res.end(JSON.stringify(response))
}
