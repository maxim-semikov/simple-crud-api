import http from 'node:http';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/usersController';
import { CONTENT_TYPE, ERROR_MESSAGES } from '../const';
import { StoreType } from '../store';

export async function handleUserRequest(
  store: StoreType,
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const method = req.method;
  const url = req.url?.replace(/^\/api/, '');

  if (url === '/users' && method === 'GET') {
    getUsers(store, res);
  } else if (url?.startsWith('/users') && method === 'POST') {
    await createUser(store, req, res);
  } else if (url?.startsWith('/users/') && method === 'GET') {
    const id = url.split('/')[2];
    getUserById(store, res, id);
  } else if (url?.startsWith('/users/') && method === 'PUT') {
    const id = url.split('/')[2];
    await updateUser(store, req, res, id);
  } else if (url?.startsWith('/users/') && method === 'DELETE') {
    const id = url.split('/')[2];
    deleteUser(store, res, id);
  } else {
    res.writeHead(404, CONTENT_TYPE.TEXT);
    res.end(ERROR_MESSAGES['404']);
  }
}
