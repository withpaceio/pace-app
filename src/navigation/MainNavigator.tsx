import React, { type FC } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '@auth';

import PaywallScreen from '@screens/paywall/PaywallScreen';
import ChangeDefaultActivityTypeScreen from '@screens/settings/ChangeDefaultActivityTypeScreen';
import ChangeDisplayPreferencesScreen from '@screens/settings/ChangeDisplayPreferencesScreen';
import ChangePasswordScreen from '@screens/settings/ChangePasswordScreen';
import ChooseProfilePictureScreen from '@screens/settings/ChooseProfilePictureScreen';
import ConfigureHealthInformationScreen from '@screens/settings/ConfigureHealthInformationScreen';
import ConfigureRecoveryEmailScreen from '@screens/settings/ConfigureRecoveryEmailScreen';
import i18n from '@translations/i18n';

import AuthNavigator from './AuthStackNavigator';
import HomeNavigator from './HomeStackNavigator';
import Screens from './screens';
import type { MainStackParamList } from './types';

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator: FC = () => {
  const { state } = useAuth();

  return (
    <Stack.Navigator>
      {state.profileData === null ? (
        <Stack.Screen
          name={Screens.AUTH_NAVIGATOR}
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name={Screens.HOME_NAVIGATOR}
            component={HomeNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={Screens.CHANGE_DEFAULT_ACTIVTY_TYPE}
            component={ChangeDefaultActivityTypeScreen}
            options={{
              headerTitle: i18n.t('settings.changeDefaultActivityType.screenTitle'),
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name={Screens.CHANGE_DISPLAY_PREFERENCES}
            component={ChangeDisplayPreferencesScreen}
            options={{
              headerTitle: i18n.t('settings.changeDisplayPreferences.screenTitle'),
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name={Screens.CONFIGURE_HEALTH_INFORMATION}
            component={ConfigureHealthInformationScreen}
            options={{
              headerTitle: i18n.t('settings.configureHealthInformation.screenTitle'),
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name={Screens.PAYWALL}
            component={PaywallScreen}
            options={{ headerTitle: i18n.t('paywall.screenTitle'), headerLeft: () => null }}
          />
          <Stack.Screen
            name={Screens.CHANGE_PASSWORD}
            component={ChangePasswordScreen}
            options={{
              headerTitle: i18n.t('settings.changePassword.screenTitle'),
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name={Screens.CONFIGURE_RECOVERY_EMAIL}
            component={ConfigureRecoveryEmailScreen}
            options={{
              headerTitle: i18n.t('settings.recoveryEmail.screenTitle'),
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name={Screens.CHOOSE_PROFILE_PICTURE}
            component={ChooseProfilePictureScreen}
            options={{
              headerTitle: i18n.t('settings.chooseProfilePicture.screenTitle'),
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
