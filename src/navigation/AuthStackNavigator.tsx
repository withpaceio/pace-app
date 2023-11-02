import React, { type FC } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import OnboardingScreen from '@screens/auth/OnboardingScreen';
import SignInScreen from '@screens/auth/SignInScreen';
import SignUpScreen from '@screens/auth/SignUpScreen';

import Screens from './screens';
import type { AuthStackParamList } from './types';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: FC = () => (
  <Stack.Navigator initialRouteName={Screens.ONBOARDING}>
    <Stack.Screen
      name={Screens.ONBOARDING}
      component={OnboardingScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={Screens.SIGN_IN}
      // @ts-ignore
      component={SignInScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={Screens.SIGN_UP}
      // @ts-ignore
      component={SignUpScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
