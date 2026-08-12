/**
 * Conventional Commits — ver docs/07-backlog-github.md secao 6.3.
 * Validado no CI (job `qualidade`) em todo pull request.
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'test', 'docs', 'chore', 'ci', 'perf', 'build', 'revert'],
    ],
    // Mensagens em pt-BR usam acentos e a linha pode passar de 72 chars.
    'header-max-length': [2, 'always', 100],
    'subject-case': [0],
    'body-max-line-length': [0],
  },
};
