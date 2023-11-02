import React, { type FC, useCallback } from 'react';
import { Linking } from 'react-native';

import { useNetInfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@theme';

import { ShoppingBagIcon } from '@components/icons';
import { ActivityIndicator } from '@components/ui';

import Screens from '@navigation/screens';
import type { SettingsScreenProps } from '@navigation/types';
import useCurrentSubscription from '@subscription/useCurrentSubscription';
import i18n from '@translations/i18n';

import {
  ConfigureWrapper,
  EntryWrapper,
  ICON_SIZE,
  IconWrapper,
  Label,
  SecondaryLabel,
} from './common';
import {
  REVENUE_CAT_ENTITLEMENT_MONTHLY_ID,
  REVENUE_CAT_ENTITLEMENT_YEARLY_ID,
} from '../../../consts';

const ManageSubscriptionButton: FC = () => {
  const { isInternetReachable } = useNetInfo();
  const theme = useTheme();

  const navigation = useNavigation<SettingsScreenProps['navigation']>();

  const { currentSubscription, loading, managementUrl } = useCurrentSubscription();

  const onManageSubscription = useCallback((): void => {
    if (managementUrl) {
      Linking.openURL(managementUrl);
      return;
    }

    navigation.navigate(Screens.PAYWALL);
  }, [managementUrl, navigation]);

  return (
    <EntryWrapper onPress={onManageSubscription} disabled={!isInternetReachable}>
      <IconWrapper>
        <ShoppingBagIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
      </IconWrapper>
      <ConfigureWrapper>
        <Label>{i18n.t('settings.buttons.manageSubscription')}</Label>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <SecondaryLabel>
            {currentSubscription === null && i18n.t('settings.manageSubscription.freeTrial')}
            {currentSubscription?.identifier === REVENUE_CAT_ENTITLEMENT_MONTHLY_ID &&
              i18n.t('settings.manageSubscription.monthlySubscription')}
            {currentSubscription?.identifier === REVENUE_CAT_ENTITLEMENT_YEARLY_ID &&
              i18n.t('settings.manageSubscription.yearlySubscription')}
          </SecondaryLabel>
        )}
      </ConfigureWrapper>
    </EntryWrapper>
  );
};

export default ManageSubscriptionButton;
