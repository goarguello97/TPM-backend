/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/match.test.ts"],
  testTimeout: 10000,
};
