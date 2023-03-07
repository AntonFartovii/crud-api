import http from "node:http";


export const userRouter = (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write( req.url );
    res.end();
}


