export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Scope must be a known package name or a cross-cutting concern
    'scope-enum': [
      2,
      'always',
      [
        'tokens',
        'web',
        'icons',
        'react',
        'angular',
        'utils',
        'docs',
        'scripts',
        'deps',
        'config',
        'ci',
        'release',
      ],
    ],
    // Allow longer subjects for descriptive commit messages
    'subject-max-length': [2, 'always', 100],
    // Body/footer line length for long change descriptions
    'body-max-line-length': [1, 'always', 120],
  },
};
