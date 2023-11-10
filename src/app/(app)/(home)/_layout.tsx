import { type FC, useEffect, useState } from 'react';

import { Tabs } from 'expo-router/tabs';

import { useTheme } from '@theme';

import { HomeIcon, RecordIcon, UserCircleIcon } from '@components/icons';
import Header from '@components/navigation/Header';

import ActivityTask, { type RecordingListener } from '@tasks/ActivityTask';

const HomeLayout: FC = () => {
  const theme = useTheme();

  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    (async () => {
      const initialIsRecording = await ActivityTask.getInstance().isRecording();
      setIsRecording(initialIsRecording);
    })();
  }, []);

  useEffect(() => {
    const listener: RecordingListener = (recordingStatus) => {
      setIsRecording(recordingStatus === 'recording');
    };

    ActivityTask.getInstance().addRecordingListener(listener);

    return () => {
      ActivityTask.getInstance().removeRecordingListener(listener);
    };
  }, []);

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
      <Tabs.Screen
        name="record"
        options={{
          tabBarBadge: isRecording ? '' : undefined,
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
      <Tabs.Screen name="account" />
    </Tabs>
  );
};

export default HomeLayout;
