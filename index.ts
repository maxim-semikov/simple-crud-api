import os from 'node:os';
import cluster from 'node:cluster';
import { config } from 'dotenv';
import { SimpleCRUDServer } from './src/server';
import { ProxyServer } from './src/proxyServer';
import { Store } from './src/store';
import { ProxyStore } from './src/store/proxyStore';
import { storeWorkerHandler } from './src/store/storeWorkerHandler';

config();
const PORT = process.env.PORT || 4000;

const isMulti = process.argv.includes('--multi');
const availableCPUsNumber = os.availableParallelism();

if (isMulti && availableCPUsNumber > 1) {
  if (cluster.isPrimary) {
    for (let i = 1; i <= availableCPUsNumber; i++) {
      const worker = cluster.fork({ PORT: Number(PORT) + i });
      worker.on('message', storeWorkerHandler(worker));
    }

    const proxyServer = new ProxyServer(PORT);
    proxyServer.start();

    cluster.on('exit', (worker) => {
      console.log(`[exit] Worker ${worker.id}`);
    });
  } else {
    const proxyStore = new ProxyStore();
    const server = new SimpleCRUDServer(proxyStore);
    server.start(PORT);
  }
} else {
  const store = Store.createStore();
  const server = new SimpleCRUDServer(store);
  server.start(PORT);
}
