module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.spec.ts", "**/tests/**/*.test.ts", "**/?(*.)+(spec|test).[tj]s"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  clearMocks: true,
};
