const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  expo: {
    name: IS_DEV ? 'PACE (Dev)' : 'PACE',
    description: 'Private Fitness App',
    slug: 'pace',
    scheme: IS_DEV ? 'io.withpace.pace.dev' : 'io.withpace.pace',
    splash: {
      image: './assets/images/splash.png',
      backgroundColor: '#000000',
    },
    userInterfaceStyle: 'automatic',
    icon: './assets/images/app-icon.png',
    android: {
      package: IS_DEV ? 'io.withpace.pace.dev' : 'io.withpace.pace',
      versionCode: 14,
      permissions: [
        'ACCESS_FINE_LOCATION',
        'FOREGROUND_SERVICE',
        'FOREGROUND_SERVICE_LOCATION',
        'BILLING',
      ],
      blockedPermissions: ['RECORD_AUDIO'],
      adaptiveIcon: {
        foregroundImage: './assets/images/android-app-icon.png',
        backgroundColor: '#000000',
      },
    },
    ios: {
      bundleIdentifier: IS_DEV ? 'io.withpace.pace.dev' : 'io.withpace.pace',
      buildNumber: '2.1.0',
      infoPlist: {
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'Turning on location services allows PACE to record your activities.',
        NSLocationAlwaysUsageDescription:
          'Turning on location services allows PACE to record your activities.',
        NSLocationWhenInUseUsageDescription:
          'Turning on location services allows PACE to record your activities.',
        NSCameraUsageDescription: 'This allows you to create a profile picture with your camera.',
        NSPhotoLibraryUsageDescription:
          'This allows you to choose an existing picture in your library for your profile picture.',
        UIBackgroundModes: ['location'],
      },
      privacyManifests: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
            NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
          },
        ],
      },
    },
    plugins: [
      'expo-font',
      'expo-router',
      'expo-secure-store',
      '@maplibre/maplibre-react-native',
      [
        'expo-build-properties',
        {
          ios: { newArchitectureEnabled: true },
          android: { newArchitectureEnabled: true },
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'bbc52990-d7d4-11e9-a07a-3d3351b36399',
      },
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    updates: {
      url: 'https://u.expo.dev/bbc52990-d7d4-11e9-a07a-3d3351b36399',
    },
  },
};
