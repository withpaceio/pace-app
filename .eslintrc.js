module.exports = {
  root: true,
  extends: ['expo', 'eslint:recommended'],
  env: { browser: true, node: true },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
        'sort-imports': ['error', { ignoreCase: false, ignoreDeclarationSort: true }],
        'import/order': [
          'error',
          {
            groups: [['builtin', 'external'], 'internal', ['parent', 'sibling'], 'index'],
            pathGroups: [
              {
                pattern: '@(react|react-native)',
                group: 'external',
              },
              {
                pattern: '@(@activity|@auth|@crypto|@theme)',
                group: 'internal',
                position: 'before',
              },
              { pattern: '@api/**', group: 'internal' },
              { pattern: '@components/**', group: 'internal' },
              { pattern: '@models/**', group: 'internal' },
              { pattern: '@navigation/**', group: 'internal' },
              { pattern: '@screens/**', group: 'internal' },
              { pattern: '@subscription/**', group: 'internal' },
              { pattern: '@tasks/**', group: 'internal' },
              { pattern: '@translations/**', group: 'internal' },
              { pattern: '@utils/**', group: 'internal' },
            ],
            pathGroupsExcludedImportTypes: ['internal', 'react'],
            'newlines-between': 'always-and-inside-groups',
          },
        ],
      },
    },
  ],
};
