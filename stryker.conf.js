const jestConfig = require(`${__dirname}/jest.config.js`);

// reporters: clear-text

module.exports = (config) => config.set({
  mutate: jestConfig.collectCoverageFrom,
  mutator: {
    name: 'javascript',
    excludedMutations: [ 'BooleanSubstitution', 'StringLiteral' ],
  },
  testRunner: 'jest',
  reporters: [ 'progress' ],
  coverageAnalysis: 'off',
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
});
