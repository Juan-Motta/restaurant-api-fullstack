import * as http from 'http';
import { DatabaseMigrationManager } from './infraestructure/adapters/output/database/migrations';


export class HttpServer {
    private server: http.Server;
    private routes: {path: string, method: string, handler: (req: http.IncomingMessage, res: http.ServerResponse) => void}[] = [];

    constructor() {
        this.server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
            const route = this.routes.find(r => r.path === req.url && r.method === req.method);
            if (route) {
                route.handler(req, res);
            } else {
                res.statusCode = 404;
                res.end('Not Found');
            }
        });
    }

    public migrate() {
        console.log('Migrating database...');
        const manager = new DatabaseMigrationManager();
        manager.run();
    }

    public listen(port: number) {
        this.server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }

    public addRoute(path: string, method: string, handler: (req: http.IncomingMessage, res: http.ServerResponse) => void) {
        this.routes.push({path, method, handler});
    }
}