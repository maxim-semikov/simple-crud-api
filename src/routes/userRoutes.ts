import http from 'http';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/usersController';
import { CONTENT_TYPE, ERROR_MESSAGES } from '../const';

export async function handleUserRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const method = req.method;
  const url = req.url?.replace(/^\/api/, '');

  if (url === '/users' && method === 'GET') {
    getUsers(res);
  } else if (url?.startsWith('/users') && method === 'POST') {
    await createUser(req, res);
  } else if (url?.startsWith('/users/') && method === 'GET') {
    const id = url.split('/')[2];
    getUserById(res, id);
  } else if (url?.startsWith('/users/') && method === 'PUT') {
    const id = url.split('/')[2];
    await updateUser(req, res, id);
  } else if (url?.startsWith('/users/') && method === 'DELETE') {
    const id = url.split('/')[2];
    deleteUser(res, id);
  } else {
    res.writeHead(404, CONTENT_TYPE.TEXT);
    res.end(ERROR_MESSAGES['404']);
  }
}
