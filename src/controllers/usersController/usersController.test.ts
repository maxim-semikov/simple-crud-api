import supertest from 'supertest';
import { SimpleCRUDServer } from '../../server';

describe('Simple CRUD API', () => {
  let server: SimpleCRUDServer;
  const mockStore = new Map();

  beforeAll(() => {
    server = new SimpleCRUDServer(mockStore);
    server.start('3010');
  });

  afterAll(() => {
    server.stop();
    mockStore.clear();
  });

  it('GET /api/users should return empty array of users', async () => {
    const { statusCode, text } = await supertest(server['server']).get('/api/users');

    expect(statusCode).toEqual(200);
    expect(text).toEqual('[]');
  });

  test('GET some-non/existing/resource should return 404', async () => {
    const response = await supertest(server['server']).get('/non-existing-path');
    expect(response.status).toBe(404);
    expect(response.text).toBe('Not Found');
  });
});
