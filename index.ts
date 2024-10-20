import { config } from 'dotenv';
import { SimpleCRUDServer } from './src/server';
import { Store } from './src/store';

config();
const PORT = process.env.PORT || '3000';

const store = Store.createStore();

const server = new SimpleCRUDServer(store);

server.start(PORT);
