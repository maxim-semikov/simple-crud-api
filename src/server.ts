import http from 'node:http';
import cluster from 'node:cluster';
import { handleUserRequest } from './routes/userRoutes';
import { CONTENT_TYPE, ERROR_MESSAGES } from './const';
import { StoreInterface } from './store';

export class SimpleCRUDServer {
  server: http.Server;

  constructor(protected store: StoreInterface) {
    this.server = http.createServer(async (req, res) => {
      if (req.url?.startsWith('/api/users')) {
        await handleUserRequest(store, req, res);
      } else {
        res.writeHead(404, CONTENT_TYPE.TEXT);
        res.end(ERROR_MESSAGES['404']);
      }
    });
  }

  start(port: string | number) {
    this.server.listen(port);
    console.log(
      cluster.isPrimary
        ? `Server running on port ${port}`
        : `Worker Server running on port ${port}`,
    );
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
