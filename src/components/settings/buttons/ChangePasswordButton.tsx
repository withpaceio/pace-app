import React, { type FC, useCallback } from 'react';

import { useNetInfo } from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';

import { useTheme } from '@theme';

import { LockIcon } from '@components/icons';

import i18n from '@translations/i18n';

import { EntryWrapper, ICON_SIZE, IconWrapper, Label } from './common';

const ChangePasswordButton: FC = () => {
  const { isInternetReachable } = useNetInfo();
  const theme = useTheme();
  const router = useRouter();

  const onChangePassword = useCallback((): void => {
    router.push('/settings/change-password');
  }, [router]);

  return (
    <EntryWrapper onPress={onChangePassword} disabled={!isInternetReachable}>
      <IconWrapper>
        <LockIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
      </IconWrapper>
      <Label>{i18n.t('settings.buttons.changePassword')}</Label>
    </EntryWrapper>
  );
};

export default ChangePasswordButton;
