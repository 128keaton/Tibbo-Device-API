export default {
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  testRegex: ".*\\.test\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "coverageReporters": [
    "json-summary",
    "html"
  ],
  testEnvironment: "node",
  rootDir: "src",
  "collectCoverageFrom": [
    "**/*.(t|j)s",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/_generated/**",
    "!**/*.module.ts",
    "!**/*.request.ts",
    "!**/*.response.ts",
    "!**/index.ts",
    "!**/main.ts",
    "!**/*.type.ts",
    "!**/*.config.ts",
    "!**/*.defaults.ts",
    "!**/*.extension.ts",
    "!**/cli.ts"
  ],
  collectCoverage: true,
  coverageDirectory: "../coverage"
};
