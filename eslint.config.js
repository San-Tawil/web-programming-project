import globals from 'globals';

const rules = {
  'no-constant-binary-expression': 'error',
  'no-dupe-keys': 'error',
  'no-duplicate-case': 'error',
  'no-undef': 'error',
  'no-unreachable': 'error',
};

export default [
  { ignores: ['dist/**'] },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules,
  },
  {
    files: ['*.config.js', 'src/**/*.test.js'],
    languageOptions: { globals: globals.node },
    rules,
  },
];
