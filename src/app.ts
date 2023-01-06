import http, {IncomingMessage, ServerResponse, Server} from "http";

export type RequestListener = (
    req: IncomingMessage,
    res: ServerResponse,
    options: HandlerOptions,
    ) => void;

export interface HandlerOptions {
    [key: string]: any;
}

export interface Routes {
    [method: string]: {
        [path: string]: RequestListener;
    }
}

const routes: Routes = {
    // [METHODS.GET]: {},
    // [METHODS.POST]: {},
    // [METHODS.PUT]: {},
    // [METHODS.DELETE]: {},
};

export class App {
    private _server: Server;

    constructor() {
        this._server = http.createServer()
    }

    public listen( PORT: number, cb: () => void ) {
        return this._server.listen( PORT, cb )
    }

    public use(path: string, cb: RequestListener): void {

    }

    public get(path: string, cb: RequestListener): void {

    }
}
