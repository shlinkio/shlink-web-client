module.exports = {
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/*.{ts,tsx}',
    '!src/reducers/index.ts',
    '!src/**/provideServices.ts',
    '!src/container/*.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 80,
      functions: 80,
      lines: 85,
    },
  },
  setupFiles: [ '<rootDir>/config/jest/setupEnzyme.js' ],
  testMatch: [ '<rootDir>/test/**/*.test.{ts,tsx}' ],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(ts|tsx|js)$': '<rootDir>/node_modules/babel-jest',
    '^(?!.*\\.(ts|tsx|js|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    '<rootDir>/.stryker-tmp',
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    '^.+\\.module\\.scss$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.scss$': 'identity-obj-proxy',
    // Reactstrap module resolution does not work in jest for some reason. Manually mapping it solves the problem
    'reactstrap': '<rootDir>/node_modules/reactstrap/dist/reactstrap.umd.js',
  },
  moduleFileExtensions: [ 'js', 'ts', 'tsx', 'json' ],
};
