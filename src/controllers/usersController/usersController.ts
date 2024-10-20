import http from 'node:http';
import { Store } from '../../store';
import { createUUID, getRequestBody, uuidValidateV4 } from '../../helpers';
import { getUserNotExistMessage, USER_ERROR_MESSAGE } from './helpers';
import { CONTENT_TYPE, ERROR_MESSAGES } from '../../const';

export function getUsers(store: Store, res: http.ServerResponse): void {
  res.writeHead(200, CONTENT_TYPE.JSON);
  res.end(JSON.stringify(store.getStoreValues()));
}

export function getUserById(
  store: Store,
  res: http.ServerResponse,
  userId: string | undefined,
): void {
  if (userId && uuidValidateV4(userId)) {
    const user = store.getItem(userId);

    if (user) {
      res.writeHead(200, CONTENT_TYPE.JSON);
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, CONTENT_TYPE.JSON);
      res.end(JSON.stringify({ message: getUserNotExistMessage(userId) }));
    }
  } else {
    res.writeHead(400, CONTENT_TYPE.JSON);
    res.end(JSON.stringify({ message: USER_ERROR_MESSAGE.INVALID_ID }));
  }
}

export async function createUser(
  store: Store,
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  try {
    const body = await getRequestBody(req);

    try {
      const newUserRequestData = JSON.parse(body);

      if (newUserRequestData?.username && newUserRequestData?.age && newUserRequestData?.hobbies) {
        const userId = createUUID();
        const newUser = { id: userId, ...newUserRequestData };
        store.setItem(userId, newUser);
        res.writeHead(201, CONTENT_TYPE.JSON);
        res.end(JSON.stringify(newUser));
      } else {
        res.writeHead(400, CONTENT_TYPE.JSON);
        res.end(JSON.stringify({ message: USER_ERROR_MESSAGE.INVALID_USER_DATA }));
      }
    } catch {
      res.writeHead(500, CONTENT_TYPE.JSON);
      res.end(JSON.stringify({ message: ERROR_MESSAGES.JSON_PARS }));
    }
  } catch {
    res.writeHead(500, CONTENT_TYPE.JSON);
    res.end(JSON.stringify({ message: ERROR_MESSAGES.REQUEST_PARS }));
  }
}

export async function updateUser(
  store: Store,
  req: http.IncomingMessage,
  res: http.ServerResponse,
  userId: string | undefined,
): Promise<void> {
  if (userId && uuidValidateV4(userId)) {
    const user = store.getItem(userId as string);

    if (user) {
      try {
        const body = await getRequestBody(req);

        try {
          const newUserData = JSON.parse(body);
          const updatedData = { ...user, ...newUserData };

          store.setItem(userId, updatedData);

          res.writeHead(201, CONTENT_TYPE.JSON);
          res.end(JSON.stringify(updatedData));
        } catch {
          res.writeHead(500, CONTENT_TYPE.JSON);
          res.end(JSON.stringify({ message: ERROR_MESSAGES.JSON_PARS }));
        }
      } catch {
        res.writeHead(500, CONTENT_TYPE.JSON);
        res.end(JSON.stringify({ message: ERROR_MESSAGES.REQUEST_PARS }));
      }
    } else {
      res.writeHead(404, CONTENT_TYPE.JSON);
      res.end(JSON.stringify({ message: getUserNotExistMessage(userId) }));
    }
  } else {
    res.writeHead(400, CONTENT_TYPE.JSON);
    res.end(JSON.stringify({ message: USER_ERROR_MESSAGE.INVALID_ID }));
  }
}

export function deleteUser(
  store: Store,
  res: http.ServerResponse,
  userId: string | undefined,
): void {
  if (userId && uuidValidateV4(userId)) {
    const hasUser = store.hasItem(userId);

    if (hasUser) {
      store.removeItem(userId);
      res.writeHead(204, CONTENT_TYPE.JSON);
      res.end();
    } else {
      res.writeHead(404, CONTENT_TYPE.JSON);
      res.end(JSON.stringify({ message: getUserNotExistMessage(userId) }));
    }
  } else {
    res.writeHead(400, CONTENT_TYPE.JSON);
    res.end(JSON.stringify({ message: USER_ERROR_MESSAGE.INVALID_ID }));
  }
}
