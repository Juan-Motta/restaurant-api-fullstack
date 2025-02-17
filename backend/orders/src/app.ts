import { HttpServer } from './infraestructure/adapters/input/api/api'
import {
    createOrderController,
    listAllOrdersController
} from './infraestructure/adapters/input/api/orders'
import { settings } from './infraestructure/config/settings'

const server = new HttpServer()

server.addRoute('/orders', 'POST', createOrderController)
server.addRoute('/orders', 'GET', listAllOrdersController)

server.listen(settings.API_PORT)
