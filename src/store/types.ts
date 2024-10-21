export type UserId = string;

export type User = {
  id: UserId;
  username: string;
  age: number;
  hobbies: string[];
};

export interface StoreInterface {
  setItem(key: UserId, value: User): void | Promise<void>;
  getItem(key: UserId): User | undefined | Promise<User | undefined>;
  hasItem(key: UserId): boolean | Promise<boolean>;
  removeItem(key: UserId): boolean | Promise<boolean>;
  clear(): void | Promise<void>;
  getStoreValues(): User[] | Promise<User[]>;
}

export type Action =
  | 'getStoreValues'
  | 'getItem'
  | 'setItem'
  | 'hasItem'
  | 'removeItem'
  | 'clear'
  | 'Response';

export interface messageInterface {
  type: Action;
  key?: UserId;
  value?: User;
}
