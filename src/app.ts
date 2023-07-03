import * as http from 'http';
import { Router } from './Router';

export class App {
  private _server: http.Server;
  private _router: Router;

  constructor() {
    this._router = new Router();
    this._server = http.createServer();
    this._server.on('request', this._router.handleRequest);
  }

  public listen(port: number, cb?: () => void): void {
    this._server.listen(port, cb);
  }

  public get(path: string, cb: http.RequestListener): void {
    this._router.get(path, cb);
  }

  public post(path: string, cb: http.RequestListener): void {
    this._router.post(path, cb);
  }

  public delete(path: string, cb: http.RequestListener): void {
    this._router.delete(path, cb);
  }

  public update(path: string, cb: http.RequestListener): void {
    this._router.update(path, cb);
  }
}
