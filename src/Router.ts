import http from "node:http";

export class Router {
    private routes: http.RequestListener[]

    constructor() {
        this.routes = []
    }

    public get(path: string, cb: http.RequestListener) {
        this.routes.push(cb)
    }

    public post(path: string, cb: http.RequestListener) {
        this.routes.push(cb)
    }
}
