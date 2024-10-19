import http from 'http';
import { handleUserRequest } from './routes/userRoutes';

export const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/api/users')) {
    handleUserRequest(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});
