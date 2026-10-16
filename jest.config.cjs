module.exports = {
  watchman: false,
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.module\\.css$": "<rootDir>/styleMock.cjs"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"]
};