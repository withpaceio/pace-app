import type { FC } from 'react';

import { Stack } from 'expo-router/stack';

const AuthLayout: FC = () => <Stack screenOptions={{ headerShown: false }} />;

export default AuthLayout;
