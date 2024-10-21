import { StoreInterface, User, UserId } from './types';

export class Store implements StoreInterface {
  private static instance: Store;
  private value: Map<UserId, User>;

  private constructor() {
    this.value = new Map<UserId, User>();
  }

  public static createStore(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  public setItem(key: UserId, value: User): void {
    this.value.set(key, value);
  }

  public getItem(key: UserId): User | undefined {
    return this.value.get(key);
  }

  public hasItem(key: UserId): boolean {
    return this.value.has(key);
  }

  public removeItem(key: UserId): boolean {
    return this.value.delete(key);
  }

  public clear(): void {
    this.value.clear();
  }

  public getStoreValues(): User[] {
    return this.value.size ? Array.from(this.value.values()) : ([] as User[]);
  }
}
