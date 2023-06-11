import http from 'http';

type RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => void;

type Route = {
  path: string;
  method: string;
  cb: RequestListener;
};

export class Router {
  private routes: Route[] = [];

  public get(path: string, cb: RequestListener) {
    this.routes.push({
      path,
      method: 'GET',
      cb,
    });
  }

  public handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const { url, method } = req;

    const matchedRoute = this.routes.find((route) => {
      const routeRegExp = new RegExp(`^${route.path}$`);
      return routeRegExp.test(url!) && route.method === method;
    });

    if (matchedRoute) {
      const pathParams = url!.match(new RegExp(`^${matchedRoute.path}$`))?.groups;
      matchedRoute.cb(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('Not Found');
      res.end();
    }
  }
}
