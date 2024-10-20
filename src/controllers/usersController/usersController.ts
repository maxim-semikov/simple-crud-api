import http from 'http';
import { getStoreValues, store } from '../../store';
import { createUUID, getRequestBody, uuidValidateV4 } from '../../helpers';
import { getUserNotExistMessage, USER_ERROR_MESSAGE } from './helpers';
import { CONTENT_TYPE, ERROR_MESSAGES } from '../../const';

export function getUsers(res: http.ServerResponse): void {
  res.writeHead(200, CONTENT_TYPE.JSON);
  res.end(JSON.stringify(getStoreValues()));
}

export function getUserById(res: http.ServerResponse, userId: string | undefined): void {
  if (userId && uuidValidateV4(userId)) {
    const user = store.get(userId as string);

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
        store.set(userId, newUser);
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
  req: http.IncomingMessage,
  res: http.ServerResponse,
  userId: string | undefined,
): Promise<void> {
  if (userId && uuidValidateV4(userId)) {
    const user = store.get(userId as string);

    if (user) {
      try {
        const body = await getRequestBody(req);

        try {
          const newUserData = JSON.parse(body);
          const updatedData = { ...user, ...newUserData };

          store.set(userId, updatedData);

          res.writeHead(201, CONTENT_TYPE.JSON);
          res.end(JSON.stringify(updatedData));
        } catch {
          res.writeHead(500, CONTENT_TYPE.JSON);
          res.end(JSON.stringify({ message: ERROR_MESSAGES.JSON_PARS }));
        }
      } catch {
        res.writeHead(500, CONTENT_TYPE.JSON);
        res.end(JSON.stringify({ message: 'Error reading the request body' }));
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

export function deleteUser(res: http.ServerResponse, userId: string | undefined): void {
  if (userId && uuidValidateV4(userId)) {
    const user = store.get(userId as string);

    if (user) {
      store.delete(userId);
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
