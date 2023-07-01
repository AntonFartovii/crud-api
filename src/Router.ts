import http from 'http';

type RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => void;
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

export type RequestListenerWithOptions = (
  req: IncomingMessage,
  res: ServerResponse,
  options: HandlerOptions
) => void;

export interface Routes {
  [method: string]: {
    [path: string]: RequestListenerWithOptions;
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
  private addRoute = (method: METHODS, path: string, cb: RequestListenerWithOptions): void => {
    const routeParamRegExp = /(?<param>(?<=\$\{|\{)\S+(?=\}))/;
    const parsedRouteChunks = path.split('/').reduce((acc: string[], chunk) => {
      const match = chunk.match(routeParamRegExp);
      const paramName = match?.groups?.param;
      acc.push(paramName ? `(?<${paramName}>\\S+)` : chunk);
      return acc;
    }, []);
    const pathString = `^${parsedRouteChunks.join('/')}\\/?$`;
    routes[method][pathString] = cb;
  };

  public get(path: string, cb: RequestListenerWithOptions): void {
    this.addRoute(METHODS.GET, path, cb);
  }

  public post(path: string, cb: RequestListenerWithOptions): void {
    this.addRoute(METHODS.POST, path, cb);
  }

  public delete(path: string, cb: RequestListenerWithOptions): void {
    this.addRoute(METHODS.DELETE, path, cb);
  }

  public update(path: string, cb: RequestListenerWithOptions): void {
    this.addRoute(METHODS.PUT, path, cb);
  }

  public handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const { url, method } = req;

    console.log(url);
    console.log(method);
    // console.log('this.routes: ', routes);

    const matchedRoute = Object.keys(routes[method!]).find((pathString) => {
      const routeRegExp = new RegExp(pathString);
      return routeRegExp.test(url!);
    });

    console.log(matchedRoute);

    if (matchedRoute) {
      const pathParams = url!.match(new RegExp(matchedRoute))?.groups;

      routes[method!][matchedRoute](req, res, { params: { ...pathParams } });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'This endpoint does not exist!' }));
    }
  }
}
