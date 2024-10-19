import http from 'http';
import { getStoreValues } from '../store';

export function getUsers(res: http.ServerResponse): void {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(getStoreValues()));
}
