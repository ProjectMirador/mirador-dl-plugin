// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: [
    '<rootDir>/setupJest.js',
  ],
  testEnvironment: 'jsdom',
  // Ignore Mirador/Manifesto code from jest transforms
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(mirador|manifesto.js))',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/test-utils.js',
  ],
};
