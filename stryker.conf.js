const jestConfig = require(`${__dirname}/jest.config.js`);

module.exports = {
  mutate: jestConfig.collectCoverageFrom,
  checkers: [ 'typescript' ],
  tsconfigFile: 'tsconfig.json',
  testRunner: 'jest',
  reporters: [ 'progress', 'clear-text' ],
  coverageAnalysis: 'perTest',
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
