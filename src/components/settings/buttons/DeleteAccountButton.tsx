import React, { type FC } from 'react';

import { useNetInfo } from '@react-native-community/netinfo';

import { useTheme } from '@theme';

import { AlertOctagonIcon } from '@components/icons';

import i18n from '@translations/i18n';

import { EntryWrapper, ICON_SIZE, IconWrapper, Label } from './common';

type Props = {
  onDeleteAccount: () => void;
};

const DeleteAccountButton: FC<Props> = ({ onDeleteAccount }) => {
  const { isInternetReachable } = useNetInfo();
  const theme = useTheme();

  return (
    <EntryWrapper onPress={onDeleteAccount} disabled={!isInternetReachable}>
      <IconWrapper>
        <AlertOctagonIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
      </IconWrapper>
      <Label>{i18n.t('settings.buttons.deleteAccount')}</Label>
    </EntryWrapper>
  );
};

export default DeleteAccountButton;
