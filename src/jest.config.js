// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "\\.(scss)$": "<rootDir>/Assets/Javascript/__mocks__/styleMock.js"
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/vendor/"]
}
