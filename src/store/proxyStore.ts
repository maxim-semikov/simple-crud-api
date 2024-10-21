import { Action, StoreInterface, User, UserId } from './types';

export class ProxyStore implements StoreInterface {
  async sendToMaster(type: Action, key?: UserId, value?: User): Promise<any> {
    return new Promise((resolve) => {
      const message = { type, key, value };
      if (process?.send) {
        process.send(message);
      }

      process?.once(
        'message',
        (response: { type: Action; data?: User | User[] | boolean | undefined }) => {
          if (response?.type === 'Response') {
            resolve(response?.data);
          }
        },
      );
    });
  }

  async setItem(key: UserId, value: User): Promise<void> {
    return await this.sendToMaster('setItem', key, value);
  }

  async getItem(key: UserId): Promise<User | undefined> {
    return await this.sendToMaster('getItem', key);
  }

  async hasItem(key: UserId): Promise<boolean> {
    return await this.sendToMaster('hasItem', key);
  }

  async removeItem(key: UserId): Promise<boolean> {
    return await this.sendToMaster('removeItem', key);
  }

  async clear(): Promise<void> {
    return await this.sendToMaster('clear');
  }

  async getStoreValues(): Promise<User[]> {
    return await this.sendToMaster('getStoreValues');
  }
}
