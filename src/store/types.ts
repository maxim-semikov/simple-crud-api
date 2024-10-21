export type UserId = string;

export type User = {
  id: UserId;
  username: string;
  age: number;
  hobbies: string[];
};

export interface StoreInterface {
  setItem(key: UserId, value: User): void;
  getItem(key: UserId): User | undefined;
  hasItem(key: UserId): boolean;
  removeItem(key: UserId): boolean;
  clear(): void;
  getStoreValues(): User[];
}
