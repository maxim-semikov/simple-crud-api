import { User } from './types';

export const store = new Map<string, User>([
  ['1', { id: '1', username: 'Maxim', age: 37, hobbies: ['coding'] }],
]);
