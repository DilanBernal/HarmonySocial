module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [
    "**/tests/**/*.spec.ts", 
    "**/tests/**/*.test.ts", 
    "**/?(*.)+(spec|test|specs).[tj]s", 
    "**/tests/**/*.specs.ts"
  ],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  clearMocks: true,
  
  // ✅ AÑADE ESTAS CONFIGURACIONES:
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/**/bootstrap/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};