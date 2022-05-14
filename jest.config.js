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
      statements: 90,
      branches: 80,
      functions: 85,
      lines: 90,
    },
  },
  setupFiles: ['<rootDir>/config/jest/setupBeforeEnzyme.js', '<rootDir>/config/jest/setupEnzyme.js'],
  setupFilesAfterEnv: ['<rootDir>/config/jest/setupTests.ts'],
  testMatch: ['<rootDir>/test/**/*.test.{ts,tsx}'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  transform: {
    '^.+\\.(ts|tsx|js)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.scss$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(ts|tsx|js|json|scss)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    '<rootDir>/.stryker-tmp',
    'node_modules\/(?!(\@react-leaflet|react-leaflet|leaflet|react-chartjs-2|react-colorful)\/)',
    '^.+\\.module\\.scss$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.scss$': 'identity-obj-proxy',
    'react-chartjs-2': '<rootDir>/node_modules/react-chartjs-2/dist/index.js',
    'uuid': '<rootDir>/node_modules/uuid/dist/index.js',
  },
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
};
