import React, { type FC, useMemo } from 'react';
import { ScrollView, type StyleProp, type ViewStyle } from 'react-native';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { Text } from '@components/ui';

import i18n from '@translations/i18n';

import {
  ChangePasswordButton,
  DeleteAccountButton,
  DisplayPreferencesButton,
  HealthInformationButton,
  ManageSubscriptionButton,
  RecoveryEmailButton,
  RestorePurchaseButton,
  SignOutButton,
  SportPreferencesButton,
} from './buttons';
import { version } from '../../../package.json';

const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Separator = styled.View`
  width: 100%;

  border-bottom-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.separatorColor};

  margin-top: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const Version = styled(Text)`
  align-self: center;
  margin-top: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
  color: ${({ theme }) => theme.colors.secondary};
`;

type Props = {
  onDeleteAccount: () => void;
};

const SettingsUI: FC<Props> = ({ onDeleteAccount }) => {
  const theme = useTheme();

  const scrollViewContainerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingTop: theme.sizes.outerPadding,
      backgroundColor: theme.colors.background,
    }),
    [theme],
  );

  return (
    <Wrapper>
      <ScrollView contentContainerStyle={scrollViewContainerStyle}>
        <DisplayPreferencesButton />
        <HealthInformationButton />
        <SportPreferencesButton />
        <Separator />
        <RecoveryEmailButton />
        <ChangePasswordButton />
        <Separator />
        <ManageSubscriptionButton />
        <RestorePurchaseButton />
        <DeleteAccountButton onDeleteAccount={onDeleteAccount} />
        <Separator />
        <SignOutButton />
      </ScrollView>
      <Version>{i18n.t('settings.version', { version })}</Version>
    </Wrapper>
  );
};

export default SettingsUI;
