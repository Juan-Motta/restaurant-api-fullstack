import { HttpServer } from './infraestructure/adapters/input/api/api'
import {
    getAllIngredients
} from './infraestructure/adapters/input/api/storage'
import { settings } from './infraestructure/config/settings'

const server = new HttpServer()

server.addRoute('/ingredients', 'GET', getAllIngredients)

server.listen(settings.API_PORT)
