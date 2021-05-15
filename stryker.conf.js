const jestConfig = require(`${__dirname}/jest.config.js`);

module.exports = {
  mutate: jestConfig.collectCoverageFrom,
  checkers: [ 'typescript' ],
  tsconfigFile: 'tsconfig.json',
  testRunner: 'jest',
  reporters: [ 'progress', 'clear-text' ],
  ignorePatterns: [
    'coverage',
    'reports',
    'build',
    'dist',
    'home',
    'scripts',
    'docker-compose.*',
    'public/servers.json*',
  ],
  jest: {
    projectType: 'custom',
    config: jestConfig,
    enableFindRelatedTests: true,
  },
  thresholds: {
    high: 80,
    low: 60,
    break: null,
  },
  clearTextReporter: {
    logTests: false,
  },
};
