module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: { eslint: recommended, prettier },
  parserOptions: {
    ecmaVersion: latest,
    sourceType: module
  },
  rules: {
    indent: { warn, tab },
    quotes: { error, single },
    semi: { error, always }
  },
  ignorePatterns: ['tests', 'setupTests.js', '*.test.js', 'migrations', 'models'],
};
