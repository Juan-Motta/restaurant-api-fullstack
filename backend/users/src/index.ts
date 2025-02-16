import { HttpServer } from './app'
import {
    loginController,
    registerUserController
} from './infraestructure/adapters/input/api/users'

const server = new HttpServer()

server.addRoute('/signin', 'POST', registerUserController)
server.addRoute('/login', 'POST', loginController)

server.listen(3000)
