export type UserId = string;

export type User = {
  id: UserId;
  username: string;
  age: number;
  hobbies: string[];
};

export type StoreType = Map<UserId, User>;
