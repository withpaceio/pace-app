import type { FC } from 'react';

import { Stack } from 'expo-router';

import Header from '@components/navigation/Header';

const HomeLayout: FC = () => (
  <Stack>
    <Stack.Screen
      name="index"
      options={{ headerShown: true, header: Header, headerTransparent: true }}
    />
  </Stack>
);

export default HomeLayout;
