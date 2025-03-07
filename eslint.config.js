import shlink from '@shlinkio/eslint-config-js-coding-standard';
import reactCompiler from 'eslint-plugin-react-compiler';

/* eslint-disable-next-line no-restricted-exports */
export default [
  ...shlink,
  reactCompiler.configs.recommended,
];
