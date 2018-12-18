module.exports = {
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/registerServiceWorker.js',
    '!src/index.js',
    '!src/**/provideServices.js',
    '!src/container/*.js',
  ],
  setupFiles: [
    '<rootDir>/config/polyfills.js',
    '<rootDir>/config/setupEnzyme.js',
  ],
  testMatch: [ '<rootDir>/test/**/*.test.{js,jsx,mjs}' ],
  testEnvironment: 'node',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|mjs|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  transformIgnorePatterns: [ '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$' ],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
  },
  moduleFileExtensions: [
    'web.js',
    'js',
    'json',
    'web.jsx',
    'jsx',
    'node',
    'mjs',
  ],
};
