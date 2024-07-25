import eslintjs from '@eslint/js';

const {configs: eslintConfigs} = eslintjs;

export default [
  {
    ...eslintConfigs.recommended,
    files: ['lib/**/*.js'],
  }
];
