module.exports = {
  root: true,
  extends: ['universe/native'],
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
        'sort-imports': ['error', { ignoreCase: false, ignoreDeclarationSort: true }],
        'import/order': [
          'error',
          {
            groups: [['external', 'builtin'], 'internal', ['sibling', 'parent'], 'index'],
            pathGroups: [
              {
                pattern: '@(react|react-native)',
                group: 'external',
                position: 'before',
              },
              {
                pattern: '@(@activity|@auth|@crypto|@theme)',
                group: 'internal',
                position: 'before',
              },
              { pattern: '@api/**', group: 'internal', position: 'before' },
              { pattern: '@components/**', group: 'internal', position: 'before' },
              { pattern: '@models/**', group: 'internal' },
              { pattern: '@navigation/**', group: 'internal' },
              { pattern: '@screens/**', group: 'internal' },
              { pattern: '@subscription/**', group: 'internal' },
              { pattern: '@tasks/**', group: 'internal' },
              { pattern: '@translations/**', group: 'internal' },
              { pattern: '@utils/**', group: 'internal' },
            ],
            pathGroupsExcludedImportTypes: ['internal', 'react'],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
      },
    },
  ],
};
