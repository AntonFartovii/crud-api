import http from 'node:http'
import cluster from 'node:cluster'
import process from 'node:process'
import { cpus } from 'node:os'

import 'dotenv/config'
import {App} from "./src/app"
import {IncomingMessage, ServerResponse} from "http";
import {userRouter} from "./src/routerUsers";

const countCPUs = cpus().length
const PORT: number = Number( process.env.PORT )
const app: any = new App()

app.get('/users', userRouter);

if ( cluster.isPrimary ) {
    console.log(`Primary ${process.pid} is running`)

    for (let i = 0; i < countCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`)
    });
} else {

    app.listen(PORT, () => {
        // console.log( `Server running on port ${PORT}`)
        console.log(`Worker ${process.pid} started`)
    })
}



