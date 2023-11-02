module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        alias: {
          '@activity': './src/activity',
          '@api': './src/api',
          '@auth': './src/auth',
          '@components': './src/components',
          '@crypto': './src/crypto',
          '@models': './src/models',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@subscription': './src/subscription',
          '@tasks': './src/tasks',
          '@theme': './src/theme',
          '@translations': './src/translations',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
