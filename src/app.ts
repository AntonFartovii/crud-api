import * as http from 'http';

export class App {
    private _server: http.Server;
    private _router: http.RequestListener;

    constructor() {
        this._router = (req: http.IncomingMessage, res: http.ServerResponse) => {
        };
        this._server = http.createServer(this._router);
    }

    public listen(port: number, cb?: () => void): void {
        this._server.listen(port, cb);
    }

    public get(path: string, cb: http.RequestListener): void {

        this._router = (req: http.IncomingMessage, res: http.ServerResponse) => {
            if (req.url === path && req.method === 'GET') {
                cb(req, res);
            } else {
                this.res404(req, res)
            }
        };
        this._server.on('request', this._router);
    }

    public post(path: string, cb: http.RequestListener): void {
        this._router = (req: http.IncomingMessage, res: http.ServerResponse) => {
            if (req.url === path && req.method === 'POST') {
                cb(req, res);
            } else {
                this.res404(req, res)
            }
        };
        this._server.on('request', this._router);
    }

    private res404(req: http.IncomingMessage, res: http.ServerResponse): void {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Not Found');
        res.end();
    }
}
