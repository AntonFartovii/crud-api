import * as http from 'http';
import { Router } from './Router';

export class App {
  private _server: http.Server;
  private _router: Router;

  constructor() {
    this._router = new Router();
    this._server = http.createServer(this._router.handleRequest);
  }

  public listen(port: number, cb?: () => void): void {
    this._server.listen(port, cb);
  }

  public get(path: string, cb: http.RequestListener): void {
    this._router.get(path, cb);
  }

  private res404(req: http.IncomingMessage, res: http.ServerResponse): void {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('Not Found');
    res.end();
  }
}
