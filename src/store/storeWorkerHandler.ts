import { Worker } from 'node:cluster';
import { Store } from './store';
import { messageInterface } from './types';

const store = Store.createStore();

export const storeWorkerHandler = (worker: Worker) => (msgFromWorker: messageInterface) => {
  if (msgFromWorker?.type === 'getStoreValues') {
    const data = store.getStoreValues();
    worker.send({ type: 'Response', data });
  }

  if (msgFromWorker?.type === 'setItem' && msgFromWorker.key && msgFromWorker.value) {
    store.setItem(msgFromWorker.key, msgFromWorker.value);
    worker.send({ type: 'Response', data: null });
  }

  if (msgFromWorker?.type === 'getItem' && msgFromWorker.key) {
    const item = store.getItem(msgFromWorker.key);
    worker.send({ type: 'Response', data: item });
  }

  if (msgFromWorker?.type === 'hasItem' && msgFromWorker.key) {
    const hasItem = store.hasItem(msgFromWorker.key);
    worker.send({ type: 'Response', data: hasItem });
  }

  if (msgFromWorker?.type === 'removeItem' && msgFromWorker.key) {
    store.removeItem(msgFromWorker.key);
    worker.send({ type: 'Response', data: null });
  }
};
