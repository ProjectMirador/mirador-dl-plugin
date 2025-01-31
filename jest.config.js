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
  // Ignore Mirador/Manifesto/dnd libs code from jest transforms
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(mirador|manifesto.js|react-dnd|dnd-core|@react-dnd|dnd-multi-backend|rdndmb-html5-to-touch|react-mosaic-component2|lodash-es))',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/test-utils.js',
  ],
};
