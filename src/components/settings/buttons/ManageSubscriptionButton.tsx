import React, { type FC, useCallback } from 'react';
import { Linking } from 'react-native';

import { useRouter } from 'expo-router';

import { useNetInfo } from '@react-native-community/netinfo';

import { useTheme } from '@theme';

import { ShoppingBagIcon } from '@components/icons';
import { ActivityIndicator } from '@components/ui';

import useCurrentSubscription from '@subscription/useCurrentSubscription';

import i18n from '@translations/i18n';

import {
  REVENUE_CAT_ENTITLEMENT_MONTHLY_ID,
  REVENUE_CAT_ENTITLEMENT_YEARLY_ID,
} from '../../../consts';
import {
  ConfigureWrapper,
  EntryWrapper,
  ICON_SIZE,
  IconWrapper,
  Label,
  SecondaryLabel,
} from './common';

const ManageSubscriptionButton: FC = () => {
  const { isInternetReachable } = useNetInfo();
  const router = useRouter();
  const theme = useTheme();

  const { currentSubscription, loading, managementUrl } = useCurrentSubscription();

  const onManageSubscription = useCallback((): void => {
    if (managementUrl) {
      Linking.openURL(managementUrl);
      return;
    }

    router.push('/settings/paywall');
  }, [managementUrl, router]);

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
