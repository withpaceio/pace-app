import React, { type FC, useCallback } from 'react';

import { useRouter } from 'expo-router';

import { useTheme } from '@theme';

import usePreferences from '@api/preferences/usePreferences';

import { PreferencesIcon } from '@components/icons';
import { ActivityIndicator } from '@components/ui';

import i18n from '@translations/i18n';

import {
  ConfigureWrapper,
  EntryWrapper,
  ICON_SIZE,
  IconWrapper,
  Label,
  SecondaryLabel,
} from './common';

const DisplayPreferencesButton: FC = () => {
  const router = useRouter();
  const theme = useTheme();

  const { data: preferencesData, isFetching } = usePreferences();

  const onChangeDisplayPreferences = useCallback((): void => {
    router.push('/settings/display-preferences');
  }, [router]);

  return (
    <EntryWrapper onPress={onChangeDisplayPreferences}>
      <IconWrapper>
        <PreferencesIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
      </IconWrapper>
      <ConfigureWrapper>
        <Label>{i18n.t('settings.buttons.displayPreferences')}</Label>
        {!preferencesData && isFetching ? (
          <ActivityIndicator />
        ) : (
          <SecondaryLabel>
            {`${i18n.t('settings.changeDisplayPreferences.units.label')}: ${i18n.t(
              `settings.changeDisplayPreferences.units.${preferencesData?.measurement || 'metric'}`,
            )}`}
          </SecondaryLabel>
        )}
      </ConfigureWrapper>
    </EntryWrapper>
  );
};

export default DisplayPreferencesButton;
