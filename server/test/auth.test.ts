import request from 'supertest';
import server from '../src/App';


describe('Auth Routes', () => {
  beforeAll(async () => {
    await server.ready(); // 确保 Fastify 服务器已准备好
  });

  it('should register a new user', async () => {
    const response = await request(server.server)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username', 'testuser');
    expect(response.body).toHaveProperty('email', 'test@example.com');
    // 可以添加更多断言来验证响应内容
  });

  it('should login an existing user', async () => {
    // 假设已经有一个用户存在，或者在测试前先注册一个用户
    const loginResponse = await request(server.server)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'password123',
      })
      .expect(200);

    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body).toHaveProperty('user');
    expect(loginResponse.body.user).toHaveProperty('username', 'testuser');
  });

  // 可以添加更多测试用例来覆盖不同的场景和错误情况
});