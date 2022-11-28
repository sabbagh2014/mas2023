module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ["promise"],
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    // "plugin:security/recommended",
    "plugin:promise/recommended",
    // "plugin:import/recommended",
    // "plugin:json/recommended",

    // "plugin:node/recommended-script",
  ],
  parserOptions: {
    ecmaVersion: "2021",
    sourceType: "module",
  },
  rules: {},
};
