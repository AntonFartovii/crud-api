import process from 'node:process';
import { cpus } from 'node:os';
import 'dotenv/config';
import { App } from './src/app';
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from './src/controllers/user.controller';
import cluster from 'node:cluster';
import { Worker } from 'cluster';
import http from 'http';
const isMulti = process.argv.includes('--multi');

const PORT: number = isMulti ? 5000 : Number(process.env.PORT);
const countCPUs = cpus().length;

const app: any = new App();

app.get('/users', getUsers);
app.post('/users', createUser);
app.get('/users/${userId}', getUser);
app.delete('/users/${userId}', deleteUser);
app.update('/users/${userId}', updateUser);

if (isMulti) {
  if (cluster.isPrimary) {
    process.stdout.write(`Primary ${process.pid} is running\n`);
    const workers: Worker[] = [];

    for (let i: number = 0; i < countCPUs; i++) {
      const childWorker = cluster.fork({ HOST: 'localhost', PORT: PORT + i });
      workers.push(childWorker);
      childWorker.on('message', (data) => {
        workers.forEach((worker: Worker) => worker.send(data));
      });
    }

    cluster.on('exit', (worker: Worker, code: number, signal: string): void => {
      process.stdout.write(`worker ${worker.process.pid} died, code: ${code}, signal: ${signal}`);
    });

    balancer();
  } else {
    const workerId = cluster.worker!.id;
    const workerPort = PORT + workerId;
    app.listen(workerPort, () => {
      console.log(`Worker ${process.pid} run on PORT = ${workerPort}.`);
    });
  }
} else {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

let workerIndex = 0;
function balancer() {
  const balancerServer = http.createServer((balancerRequest, balancerResponse) => {
    workerIndex = workerIndex === countCPUs ? 1 : workerIndex + 1;
    const port = PORT + workerIndex;
    const options = {
      hostname: 'localhost',
      port: port,
      path: balancerRequest.url,
      method: balancerRequest.method,
      headers: balancerRequest.headers,
    };
    console.log(port);

    const request = http.request(options, (responseFromCP) => {
      balancerResponse.statusCode = responseFromCP.statusCode || 500;
      responseFromCP.on('data', (chunk) => {
        balancerResponse.write(chunk);
      });
      responseFromCP.on('end', () => {
        balancerResponse.end();
      });
    });

    balancerRequest.on('data', (chunk) => {
      request.write(chunk);
    });

    balancerRequest.on('end', () => {
      request.end();
    });
  });
  balancerServer.listen(PORT, () => {
    console.log(`Balancer server is running on PORT ${PORT}`);
  });
}
