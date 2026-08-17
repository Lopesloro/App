// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // prospeccao-sites/automacao é um subprojeto Node independente (fora do
    // app Expo), com tsconfig e scripts próprios — ver o README dele.
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'coverage/*', 'prospeccao-sites/automacao/*'],
  },
]);
