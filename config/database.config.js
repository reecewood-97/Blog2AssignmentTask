module.exports = {
    development: {
      dialect: 'sqlite',
      storage: ':memory:', 
      logging: false
    },
    test: {
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    }
  };
  