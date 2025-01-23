const { Sequelize } = require('sequelize');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/database.config.js')[env];

const sequelize = new Sequelize(config);

const models = {};

const User = require('./user')(sequelize);
const Blog = require('./blog')(sequelize);

models.User = User;
models.Blog = Blog;

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
