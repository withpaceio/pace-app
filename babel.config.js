module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'expo-router/babel',
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
