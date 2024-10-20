import { config } from 'dotenv';
import { SimpleCRUDServer } from './src/server';
import { store } from './src/store';

config();
const PORT = process.env.PORT || '3000';

const server = new SimpleCRUDServer(store);

server.start(PORT);
