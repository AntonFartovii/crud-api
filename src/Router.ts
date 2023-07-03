import http from 'http';

import { IncomingMessage, ServerResponse } from 'http';

export enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface HandlerOptions {
  [key: string]: any;
}

export type Callback = (req: IncomingMessage, res: ServerResponse, options: HandlerOptions) => void;

export interface Routes {
  [method: string]: {
    [path: string]: Callback;
  };
}
const routes: Routes = {
  [METHODS.GET]: {},
  [METHODS.POST]: {},
  [METHODS.PUT]: {},
  [METHODS.DELETE]: {},
};

export class Router {
  constructor() {}
  private addRoute = (method: METHODS, path: string, cb: Callback): void => {
    const chunks = path.split('/').reduce((acc: string[], chunk) => {
      const match = chunk.match(/(?<param>(?<=\$\{|\{)\S+(?=\}))/);
      const paramName = match?.groups?.param;
      acc.push(paramName ? `(?<${paramName}>\\S+)` : chunk);
      return acc;
    }, []);
    const pathString = `^${chunks.join('/')}\\/?$`;
    routes[method][pathString] = cb;
  };

  public get(path: string, cb: Callback): void {
    this.addRoute(METHODS.GET, path, cb);
  }

  public post(path: string, cb: Callback): void {
    this.addRoute(METHODS.POST, path, cb);
  }

  public delete(path: string, cb: Callback): void {
    this.addRoute(METHODS.DELETE, path, cb);
  }

  public update(path: string, cb: Callback): void {
    this.addRoute(METHODS.PUT, path, cb);
  }

  public handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const { url, method } = req;

    console.log(method, ' ', url);

    const matchedRoute = Object.keys(routes[method!]).find((pathString) => {
      const routeRegExp = new RegExp(pathString);
      return routeRegExp.test(url!);
    });

    if (matchedRoute) {
      const pathParams = url!.match(new RegExp(matchedRoute))?.groups;

      routes[method!][matchedRoute](req, res, { params: { ...pathParams } });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'This endpoint does not exist!' }));
    }
  }
}
