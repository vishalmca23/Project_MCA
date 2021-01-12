module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "comma-dangle": ["error", "never"],
    "arrow-parens": ["error", "as-needed"],
    "no-param-reassign": ["error", { "props": false }],
    "no-console": "off",
    "brace-style": "off"
  }
};
