import http from 'http';
import { getUsers } from '../controllers/usersController';

export function handleUserRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  const method = req.method;
  const url = req.url?.replace(/^\/api/, '');

  if (url === '/users' && method === 'GET') {
    getUsers(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}
