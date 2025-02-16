import { HttpServer } from "./app";
import { getOrders } from "./infraestructure/adapters/input/api/orders";

const server = new HttpServer();

server.migrate();

server.addRoute('/', 'GET', getOrders);

server.listen(3000);