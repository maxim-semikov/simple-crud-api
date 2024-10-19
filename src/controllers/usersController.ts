import http from 'http';
import { getStoreValues, store } from '../store';
import { uuidValidateV4 } from '../helpers/uuidHelpers';

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
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User Id is invalid' }));
  }
}
