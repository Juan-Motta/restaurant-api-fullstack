import { HttpServer } from './app'
import {
    loginController,
    registerUserController
} from './infraestructure/adapters/input/api/users'
import {
    createOrderController,
    listAllOrdersController,
    getOrderController
} from './infraestructure/adapters/input/api/orders'
import { listAllIngredients } from './infraestructure/adapters/input/api/storage'
import { listAllBuysController } from './infraestructure/adapters/input/api/buys'
import { settings } from './infraestructure/config/settings'
import {
    getRecipeController,
    listAllRecipesController
} from './infraestructure/adapters/input/api/recipes'

const server = new HttpServer()

server.addRoute('/signin', 'POST', registerUserController)
server.addRoute('/login', 'POST', loginController)
server.addRoute('/orders', 'POST', createOrderController)
server.addRoute('/orders', 'GET', listAllOrdersController)
server.addRoute('/orders/:id', 'GET', getOrderController)
server.addRoute('/ingredients', 'GET', listAllIngredients)
server.addRoute('/buys', 'GET', listAllBuysController)
server.addRoute('/recipes/:id', 'GET', getRecipeController)
server.addRoute('/recipes', 'GET', listAllRecipesController)

server.listen(settings.API_PORT)
