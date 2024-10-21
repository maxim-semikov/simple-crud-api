import os from 'node:os';
import cluster from 'node:cluster';
import { config } from 'dotenv';
import { SimpleCRUDServer } from './src/server';
import { ProxyServer } from './src/proxyServer';
import { Store } from './src/store';

config();
const PORT = process.env.PORT || 4000;

const isMulti = process.argv.includes('--multi');
const availableCPUsNumber = os.availableParallelism();

const store = Store.createStore();

if (isMulti && availableCPUsNumber > 1) {
  if (cluster.isPrimary) {
    cluster.schedulingPolicy = cluster.SCHED_RR;

    for (let i = 1; i <= availableCPUsNumber; i++) {
      cluster.fork({ PORT: Number(PORT) + i });
    }
    const proxyServer = new ProxyServer(PORT);
    proxyServer.start();

    cluster.on('exit', (worker) => {
      console.log(`[exit] Worker ${worker.id}`);
    });
  } else {
    const server = new SimpleCRUDServer(store);
    server.start(PORT);
  }
} else {
  const server = new SimpleCRUDServer(store);
  server.start(PORT);
}
