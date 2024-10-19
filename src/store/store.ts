import { User } from './types';
import { v4 as uuiV4 } from 'uuid';

const id = uuiV4();
export const store = new Map<string, User>([
  [id, { id: id, username: 'Maxim', age: 37, hobbies: ['coding'] }],
]);
