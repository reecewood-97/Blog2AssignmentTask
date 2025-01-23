const request = require('supertest');
const bcrypt = require('bcryptjs');
process.env.NODE_ENV = 'test';
const app = require('../app');
const { sequelize, User } = require('../models');

describe('Authentication Tests', () => {
  let server;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    server = app.listen(3001);
  });

  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await server.close();
    await sequelize.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(server)
        .post('/auth/register')
        .send({
          username: 'testuser',
          email: 'test@test.com',
          password: 'password123',
          password2: 'password123'
        })
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Registration successful');
      
      const user = await User.findOne({ where: { username: 'testuser' } });
      expect(user).toBeTruthy();
      const isMatch = await bcrypt.compare('password123', user.password);
      expect(isMatch).toBe(true);
    });

    it('should fail registration with mismatched passwords', async () => {
      const response = await request(server)
        .post('/auth/register')
        .send({
          username: 'testuser',
          email: 'test@test.com',
          password: 'password123',
          password2: 'password456'
        })
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].msg).toBe('Passwords do not match');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      await User.create({
        username: 'testuser',
        email: 'test@test.com',
        password: hashedPassword
      });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        })
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
    });

    it('should fail login with incorrect password', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        })
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });
  });
});
