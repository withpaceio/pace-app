import React, { type FC, useCallback } from 'react';

import { useNetInfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@theme';

import { LockIcon } from '@components/icons';

import Screens from '@navigation/screens';
import { SettingsScreenProps } from '@navigation/types';
import i18n from '@translations/i18n';

import { EntryWrapper, ICON_SIZE, IconWrapper, Label } from './common';

const ChangePasswordButton: FC = () => {
  const { isInternetReachable } = useNetInfo();
  const theme = useTheme();
  const navigation = useNavigation<SettingsScreenProps['navigation']>();

  const onChangePassword = useCallback((): void => {
    navigation.navigate(Screens.CHANGE_PASSWORD);
  }, [navigation]);

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
