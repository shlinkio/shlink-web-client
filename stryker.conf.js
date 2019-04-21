module.exports = (config) => config.set({
  mutate: [ 'src/**/*.js' ],
  mutator: 'javascript',
  testRunner: 'jest',
  reporters: [ 'progress', 'clear-text', 'html' ],
  coverageAnalysis: 'off',
  jest: {
    projectType: 'custom',
    config: require(`${__dirname}/jest.config.js`),
    enableFindRelatedTests: true,
  },
  thresholds: {
    high: 80,
    low: 60,
    break: null,
  },
});
