module.exports = {
  setupFiles: ["<rootDir>/src/setup-tests.js"],
  moduleNameMapper: {
    "@openmrs/esm-core-context":
      "<rootDir>/__mocks__/openmrs-esm-core-context.mock.tsx",
  },
};
