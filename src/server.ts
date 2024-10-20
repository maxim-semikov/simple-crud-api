import http from 'http';
import { handleUserRequest } from './routes/userRoutes';
import { CONTENT_TYPE, ERROR_MESSAGES } from './const';
import { StoreTyp } from './store';

export class SimpleCRUDServer {
  server: http.Server;

  constructor(private store: StoreTyp) {
    this.server = http.createServer(async (req, res) => {
      if (req.url?.startsWith('/api/users')) {
        await handleUserRequest(req, res);
      } else {
        res.writeHead(404, CONTENT_TYPE.TEXT);
        res.end(ERROR_MESSAGES['404']);
      }
    });
  }

  start(port: string) {
    this.server.listen(port);
    console.log(`Server running on port ${port}`);
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
