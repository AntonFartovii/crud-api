import cluster from 'node:cluster';
import process from 'node:process';
import { cpus } from 'node:os';

import 'dotenv/config';
import { App } from './src/app';
import { Worker } from 'cluster';
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from './src/controllers/user.controller';

const countCPUs: number = cpus().length;
const PORT: number = Number(process.env.PORT);
const app: any = new App();

app.get('/users', getUsers);
app.post('/users', createUser);
app.get('/users/${userId}', getUser);
app.delete('/users/${userId}', deleteUser);
app.update('/services/${userId}', updateUser);

if (cluster.isPrimary) {
  process.stdout.write(`Primary ${process.pid} is running\n`);

  for (let i: number = 0; i < countCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker: Worker, code: number, signal: string): void => {
    process.stdout.write(`worker ${worker.process.pid} died, code: ${code}, signal: ${signal}`);
  });
} else {
  app.listen(PORT, (): void => {
    process.stdout.write(`Worker ${process.pid} started\n`);
  });
}
