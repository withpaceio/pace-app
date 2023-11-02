import React, { type FC, useEffect, useState } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTheme } from '@theme';

import { HomeIcon, RecordIcon, UserCircleIcon } from '@components/icons';

import AccountScreen from '@screens/account/AccountScreen';
import HomeScreen from '@screens/home/HomeScreen';
import RecordScreen from '@screens/record/RecordScreen';

import Screens from './screens';
import type { HomeTabsParamList } from './types';
import ActivityTask, { type RecordingListener } from '../tasks/ActivityTask';

const Tab = createBottomTabNavigator<HomeTabsParamList>();

const HomeTabsNavigator: FC = () => {
  const [recording, setRecording] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    (async () => {
      const newRecording = await ActivityTask.getInstance().isRecording();
      setRecording(newRecording);
    })();
  }, []);

  useEffect(() => {
    const listener: RecordingListener = (recordingStatus): void => {
      setRecording(recordingStatus === 'recording');
    };

    ActivityTask.getInstance().addRecordingListener(listener);

    return () => {
      ActivityTask.getInstance().removedRecordingListener(listener);
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={Screens.HOME}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.purple,
        tabBarInactiveTintColor: theme.colors.primary,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case Screens.HOME:
              return <HomeIcon color={color} width={size} height={size} />;
            case Screens.ACCOUNT:
              return <UserCircleIcon color={color} width={size} height={size} />;
            case Screens.RECORD:
              return <RecordIcon color={color} width={size} height={size} />;
            default:
              return null;
          }
        },
      })}>
      {/* @ts-ignore */}
      <Tab.Screen name={Screens.HOME} component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen
        name={Screens.RECORD}
        // @ts-ignore
        component={RecordScreen}
        options={{
          headerShown: false,
          tabBarBadge: recording ? '' : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.green,
            top: theme.sizes.innerPadding,
            minWidth: theme.sizes.innerPadding,
            maxHeight: theme.sizes.innerPadding,
            borderRadius: theme.sizes.innerPadding / 2,
            lineHeight: 9,
            alignSelf: undefined,
          },
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name={Screens.ACCOUNT}
        // @ts-ignore
        component={AccountScreen}
        options={{ title: 'Account', headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabsNavigator;
