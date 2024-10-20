type UserId = string; // Или number, зависит от ваших требований

export type User = {
  id: UserId;
  username: string;
  age: number;
  hobbies: string[];
};

export type StoreTyp = Map<UserId, User>;
