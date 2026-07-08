const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",

  transform: {
    ...tsJestTransformCfg,
  },

  roots: ["<rootDir>/tests"],

  testMatch: [
    "**/*.test.ts",
    "**/*.spec.ts"
  ],

  moduleFileExtensions: [
    "ts",
    "js",
    "json"
  ],

  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts"
  ],

  coverageDirectory: "coverage",

  clearMocks: true,
};