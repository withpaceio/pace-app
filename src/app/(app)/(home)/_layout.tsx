import type { FC } from 'react';

import { Tabs } from 'expo-router/tabs';

import { useTheme } from '@theme';

import { HomeIcon, RecordIcon, UserCircleIcon } from '@components/icons';
import Header from '@components/navigation/Header';

const HomeLayout: FC = () => {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.background, borderTopWidth: 0 },
        tabBarActiveTintColor: theme.colors.purple,
        tabBarInactiveTintColor: theme.colors.primary,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'index':
              return <HomeIcon color={color} width={size} height={size} />;
            case 'account':
              return <UserCircleIcon color={color} width={size} height={size} />;
            case 'record':
              return <RecordIcon color={color} width={size} height={size} />;
            default:
              return null;
          }
        },
      })}>
      <Tabs.Screen name="index" options={{ headerShown: true, headerTitle: Header }} />
      <Tabs.Screen name="record" options={{ tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="account" />
    </Tabs>
  );
};

export default HomeLayout;
