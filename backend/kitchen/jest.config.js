module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)', '**/__tests__/**/*.[jt]s?(x)'],
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/domain/**',
    '!src/infraestructure/adapters/input/api/api.ts',
    '!src/listener.ts',
    '!src/infraestructure/adapters/output/database/models.ts'
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      lines: 80,
      branches: 75,
      functions: 80,
      statements: 80,
    },
  },
};