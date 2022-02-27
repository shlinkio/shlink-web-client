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
  setupFiles: [ '<rootDir>/config/setupEnzyme.js' ],
  testMatch: [ '<rootDir>/test/**/*.test.{ts,tsx}' ],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(ts|tsx|js)$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: {
            react: { runtime: 'automatic' },
          },
        },
      },
    ],
    '^(?!.*\\.(css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    '<rootDir>/.stryker-tmp',
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: [ 'js', 'ts', 'tsx', 'json' ],
};
