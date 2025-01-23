module.exports = {
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/test/',
      '/config/'
    ],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  };
  