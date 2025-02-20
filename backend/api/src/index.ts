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

server.addRoute('/api/v1/signin', 'POST', registerUserController)
server.addRoute('/api/v1/login', 'POST', loginController)
server.addRoute('/api/v1/orders', 'POST', createOrderController)
server.addRoute('/api/v1/orders', 'GET', listAllOrdersController)
server.addRoute('/api/v1/orders/:id', 'GET', getOrderController)
server.addRoute('/api/v1/ingredients', 'GET', listAllIngredients)
server.addRoute('/api/v1/buys', 'GET', listAllBuysController)
server.addRoute('/api/v1/recipes/:id', 'GET', getRecipeController)
server.addRoute('/api/v1/recipes', 'GET', listAllRecipesController)

server.listen(settings.API_PORT)
