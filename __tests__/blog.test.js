const request = require('supertest');
const bcrypt = require('bcryptjs');
process.env.NODE_ENV = 'test';
const app = require('../app');
const { sequelize, Blog, User } = require('../models');

describe('Blog Feature Tests', () => {
  let server;
  let testUser;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    server = app.listen(3002);
    
    testUser = await User.create({
      username: 'bloguser',
      email: 'blog@test.com',
      password: 'password123'
    });
  });

  beforeEach(async () => {
    await Blog.destroy({ where: {} });
  });

  afterAll(async () => {
    await server.close();
    await sequelize.close();
  });

  describe('Blog CRUD Operations', () => {
    it('should create a new blog post', async () => {
      const response = await request(server)
        .post('/blog/create')
        .send({
          title: 'Test Blog Post',
          content: 'This is a test blog post content'
        })
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(201);
      expect(response.body.post).toBeDefined();
      expect(response.body.post.title).toBe('Test Blog Post');
      expect(response.body.post.content).toBe('This is a test blog post content');
      expect(response.body.post.userId).toBe(testUser.id);
    });

    it('should get all blog posts', async () => {
      await Blog.create({
        title: 'Test Blog Post',
        content: 'Test content',
        userId: testUser.id
      });

      const response = await request(server)
        .get('/blog')
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body.posts).toBeDefined();
      expect(response.body.posts.length).toBe(1);
      expect(response.body.posts[0].title).toBe('Test Blog Post');
    });

    it('should search blog posts', async () => {
      await Blog.create({
        title: 'Test Blog Post',
        content: 'Test content',
        userId: testUser.id
      });
      await Blog.create({
        title: 'Another Post',
        content: 'Different content',
        userId: testUser.id
      });

      const response = await request(server)
        .get('/blog?search=Test')
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body.posts).toBeDefined();
      expect(response.body.posts.length).toBe(1);
      expect(response.body.posts[0].title).toBe('Test Blog Post');
    });

    it('should sort blog posts', async () => {
      await Blog.create({
        title: 'A Test Blog Post',
        content: 'Test content',
        userId: testUser.id
      });
      await Blog.create({
        title: 'B Another Post',
        content: 'Different content',
        userId: testUser.id
      });

      const response = await request(server)
        .get('/blog?sort=title,ASC')
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body.posts).toBeDefined();
      expect(response.body.posts.length).toBe(2);
      expect(response.body.posts[0].title).toBe('A Test Blog Post');
      expect(response.body.posts[1].title).toBe('B Another Post');
    });
  });
});
