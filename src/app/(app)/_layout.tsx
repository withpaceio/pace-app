import type { FC } from 'react';

import { Redirect, Stack } from 'expo-router';

import styled from 'styled-components/native';

import { useAuth } from '@auth';

import { ActivityIndicator } from '@components/ui';

import i18n from '@translations/i18n';

const LoadingWrapper = styled.View`
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.background};
`;

const AppLayout: FC = () => {
  const {
    state: { profileData, loading },
  } = useAuth();

  if (loading) {
    return (
      <LoadingWrapper>
        <ActivityIndicator size="large" />
      </LoadingWrapper>
    );
  }

  if (!profileData) {
    return <Redirect href="/auth" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(home)" options={{ headerShown: false }} />
      <Stack.Screen
        name="activity/save"
        options={{
          gestureEnabled: false,
          headerTitle: i18n.t('saveActivity.screenTitle'),
        }}
      />
      <Stack.Screen name="activity/[id]/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="activity/[id]/edit"
        options={{ headerTitle: i18n.t('editActivity.screenTitle') }}
      />
      <Stack.Screen name="activity/[id]/map" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings/index"
        options={{
          headerTitle: i18n.t('settings.screenTitle'),
          headerBackTitle: i18n.t('account.screenTitle'),
        }}
      />
      <Stack.Screen
        name="settings/display-preferences"
        options={{
          headerTitle: i18n.t('settings.changeDisplayPreferences.screenTitle'),
        }}
      />
      <Stack.Screen
        name="settings/health-information"
        options={{
          headerTitle: i18n.t('settings.configureHealthInformation.screenTitle'),
        }}
      />
      <Stack.Screen
        name="settings/default-activity-type"
        options={{
          headerTitle: i18n.t('settings.changeDefaultActivityType.screenTitle'),
        }}
      />
      <Stack.Screen
        name="settings/recovery-email"
        options={{
          headerTitle: i18n.t('settings.recoveryEmail.screenTitle'),
        }}
      />
      <Stack.Screen
        name="settings/change-password"
        options={{
          headerTitle: i18n.t('settings.changePassword.screenTitle'),
        }}
      />
      <Stack.Screen
        name="settings/paywall"
        options={{
          headerTitle: i18n.t('paywall.screenTitle'),
        }}
      />
      <Stack.Screen
        name="settings/profile-picture"
        options={{
          headerTitle: i18n.t('settings.chooseProfilePicture.screenTitle'),
        }}
      />
      <Stack.Screen
        name="summary/weekly"
        options={{
          headerBackTitle: i18n.t('account.screenTitle'),
          headerTitle: i18n.t('summary.weekly.screenTitle'),
        }}
      />
      <Stack.Screen
        name="summary/monthly"
        options={{
          headerBackTitle: i18n.t('account.screenTitle'),
          headerTitle: i18n.t('summary.monthly.screenTitle'),
        }}
      />
    </Stack>
  );
};

export default AppLayout;
