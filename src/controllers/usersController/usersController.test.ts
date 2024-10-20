import supertest from 'supertest';
import { SimpleCRUDServer } from '../../server';
import { User } from '../../store';
import { createUUID } from '../../helpers';

const id = createUUID();

describe('Simple CRUD API', () => {
  let server: SimpleCRUDServer;
  const testUser: User = {
    username: 'John Smith',
    age: 30,
    hobbies: ['coding'],
  } as User;
  const mockStore = new Map();

  beforeAll(() => {
    server = new SimpleCRUDServer(mockStore);
    server.start('3010');
  });

  afterEach(() => {
    mockStore.clear();
  });

  afterAll(() => {
    server.stop();
  });

  it('GET /api/users should return empty array of users', async () => {
    const { statusCode, text } = await supertest(server['server']).get('/api/users');

    expect(statusCode).toEqual(200);
    expect(text).toEqual('[]');
  });

  it('GET /api/users should return array of users', async () => {
    const user = { ...testUser, id };
    mockStore.set(id, user);
    const { statusCode, text } = await supertest(server['server']).get(`/api/users`);

    expect(statusCode).toEqual(200);
    expect(text).toEqual(JSON.stringify([user]));
  });

  it('POST /api/users should create new user and send data back', async () => {
    const { statusCode, text } = await supertest(server['server'])
      .post(`/api/users`)
      .send(testUser);
    const response = JSON.parse(text);
    const { id: newUserID } = response;
    const newUser = { ...testUser, id: newUserID };

    expect(statusCode).toEqual(201);
    expect(response).toEqual(newUser);
  });

  it('GET /api/users/id should return user data by id', async () => {
    const user = { ...testUser, id };
    mockStore.set(id, user);
    const { statusCode, text } = await supertest(server['server']).get(`/api/users/${id}`);

    expect(statusCode).toEqual(200);
    expect(text).toEqual(JSON.stringify(user));
  });

  it('DELETE /api/users/id should delete user by id', async () => {
    const user = { ...testUser, id };
    mockStore.set(id, user);
    const { statusCode } = await supertest(server['server']).delete(`/api/users/${id}`);
    expect(statusCode).toEqual(204);

    const { text } = await supertest(server['server']).get('/api/users');
    expect(text).toEqual('[]');
  });

  test('GET some-non/existing/resource should return 404', async () => {
    const response = await supertest(server['server']).get('/non-existing-path');
    expect(response.status).toBe(404);
    expect(response.text).toBe('Not Found');
  });
});
