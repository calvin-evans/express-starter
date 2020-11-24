module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: [
    './node_modules/riteway-jest/src/riteway-jest.js'
  ],
  testEnvironment: 'node'
}

