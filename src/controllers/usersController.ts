import http from 'http';
import { getStoreValues, store } from '../store';
import { createUUID, uuidValidateV4 } from '../helpers/uuidHelpers';

export function getUsers(res: http.ServerResponse): void {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(getStoreValues()));
}

export function getUserById(res: http.ServerResponse, userId: string | undefined): void {
  if (userId && uuidValidateV4(userId)) {
    const user = store.get(userId as string);

    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `User with ${userId} does not exist` }));
    }
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User Id is invalid' }));
  }
}

export function createUser(req: http.IncomingMessage, res: http.ServerResponse): void {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const newUser = JSON.parse(body);

      if (newUser?.username && newUser?.age && newUser?.hobbies) {
        const userId = createUUID();
        store.set(userId, { id: userId, ...newUser });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: 'Invalid user data. It does not contain required fields' }),
        );
      }
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Error parsing JSON' }));
    }
  });
}

export function updateUser(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  userId: string | undefined,
): void {
  if (userId && uuidValidateV4(userId)) {
    const user = store.get(userId as string);

    if (user) {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const newUserData = JSON.parse(body);
          const updatedData = { ...user, ...newUserData };

          store.set(userId, updatedData);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedData));
        } catch {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Error parsing JSON' }));
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `User with ${userId} does not exist` }));
    }
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User Id is invalid' }));
  }
}

export function deleteUser(res: http.ServerResponse, userId: string | undefined): void {
  if (userId && uuidValidateV4(userId)) {
    const user = store.get(userId as string);

    if (user) {
      store.delete(userId);
      res.writeHead(204, { 'Content-Type': 'application/json' });
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `User with ${userId} does not exist` }));
    }
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User Id is invalid' }));
  }
}
