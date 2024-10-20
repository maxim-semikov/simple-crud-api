import supertest from 'supertest';
import { SimpleCRUDServer } from '../../server';
import { store, User } from '../../store';
import { createUUID } from '../../helpers';

describe('Simple CRUD API', () => {
  let server: SimpleCRUDServer;
  const mockStore = new Map();
  let id: string;
  let testUser: User = {} as User;

  beforeAll(() => {
    server = new SimpleCRUDServer(mockStore);
    server.start('3010');
    id = createUUID();
    testUser = {
      id,
      username: ' John Smith',
      age: 30,
      hobbies: ['coding'],
    };
  });

  afterAll(() => {
    server.stop();
    mockStore.clear();
    testUser = {} as User;
  });

  it('GET /api/users should return empty array of users', async () => {
    const { statusCode, text } = await supertest(server['server']).get('/api/users');

    expect(statusCode).toEqual(200);
    expect(text).toEqual('[]');
  });

  it('GET /api/users should return array of users', async () => {
    store.set(id, testUser);
    const { statusCode, text } = await supertest(server['server']).get(`/api/users/${id}`);

    expect(statusCode).toEqual(200);
    expect(text).toEqual(JSON.stringify(testUser));
  });

  test('GET some-non/existing/resource should return 404', async () => {
    const response = await supertest(server['server']).get('/non-existing-path');
    expect(response.status).toBe(404);
    expect(response.text).toBe('Not Found');
  });
});
