import React, { type FC, useCallback, useState } from 'react';

import { useNetInfo } from '@react-native-community/netinfo';
import Purchases from 'react-native-purchases';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { RefreshClockwiseIcon } from '@components/icons';
import { ActivityIndicator, Text } from '@components/ui';

import i18n from '@translations/i18n';

import { ConfigureWrapper, EntryWrapper, ICON_SIZE, IconWrapper, Label } from './common';

const RestorePurchasesErrorText = styled(Text)`
  color: ${({ theme }) => theme.colors.red};
`;

const RestorePurchaseButton: FC = () => {
  const [restoringPurchases, setRestoringPurchases] = useState(false);
  const [restorePurchasesError, setRestorePurchasesError] = useState(false);

  const { isInternetReachable } = useNetInfo();
  const theme = useTheme();

  const onRestorePurchases = useCallback(async (): Promise<void> => {
    setRestorePurchasesError(false);
    setRestoringPurchases(true);

    try {
      await Purchases.restorePurchases();
    } catch {
      setRestorePurchasesError(true);
    } finally {
      setRestoringPurchases(false);
    }
  }, []);

  return (
    <EntryWrapper
      onPress={onRestorePurchases}
      disabled={!isInternetReachable || restoringPurchases}>
      <IconWrapper>
        <RefreshClockwiseIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
      </IconWrapper>
      <ConfigureWrapper>
        <Label>{i18n.t('settings.buttons.restorePurchases')}</Label>
        {restoringPurchases && <ActivityIndicator />}
        {!restoringPurchases && restorePurchasesError && (
          <RestorePurchasesErrorText>
            {i18n.t('settings.restorePurchases.failure')}
          </RestorePurchasesErrorText>
        )}
      </ConfigureWrapper>
    </EntryWrapper>
  );
};

export default RestorePurchaseButton;
