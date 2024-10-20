import http from 'http';
import { handleUserRequest } from './routes/userRoutes';
import { CONTENT_TYPE, ERROR_MESSAGES } from './const';

export const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith('/api/users')) {
    await handleUserRequest(req, res);
  } else {
    res.writeHead(404, CONTENT_TYPE.TEXT);
    res.end(ERROR_MESSAGES['404']);
  }
});
