const { sequelize, User, Blog } = require('../models');

describe('Database Connection', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should connect to the database', async () => {
    try {
      await sequelize.authenticate();
      expect(true).toBe(true);
    } catch (error) {
      fail('Database connection failed');
    }
  });

  it('should create tables', async () => {
    const [results] = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    const tables = results.map(r => r.name.toLowerCase());
    expect(tables).toContain('users');
    expect(tables).toContain('blogs');
  });

  describe('Model Relationships', () => {
    let user;

    beforeEach(async () => {
      await sequelize.sync({ force: true });
      user = await User.create({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      });
    });

    it('should establish User-Blog relationship', async () => {
      const blog = await Blog.create({
        title: 'Test Blog',
        content: 'Test Content',
        userId: user.id
      });

      const userWithBlogs = await User.findOne({
        where: { id: user.id },
        include: Blog
      });

      expect(userWithBlogs.Blogs).toBeDefined();
      expect(userWithBlogs.Blogs[0].title).toBe('Test Blog');
      expect(userWithBlogs.Blogs[0].userId).toBe(user.id);
    });
  });
});
