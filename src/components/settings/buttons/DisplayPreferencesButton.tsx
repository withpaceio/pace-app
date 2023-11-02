import React, { type FC, useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@theme';

import usePreferences from '@api/preferences/usePreferences';

import { PreferencesIcon } from '@components/icons';
import { ActivityIndicator } from '@components/ui';

import Screens from '@navigation/screens';
import type { AccountScreenProps } from '@navigation/types';
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
  const theme = useTheme();
  const navigation = useNavigation<AccountScreenProps['navigation']>();

  const { data: preferencesData, isFetching } = usePreferences();

  const onChangeDisplayPreferences = useCallback((): void => {
    navigation.navigate(Screens.CHANGE_DISPLAY_PREFERENCES);
  }, [navigation]);

  return (
    <EntryWrapper onPress={onChangeDisplayPreferences}>
      <IconWrapper>
        <PreferencesIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
      </IconWrapper>
      <ConfigureWrapper>
        <Label>{i18n.t('settings.buttons.displayPreferences')}</Label>
        {isFetching ? (
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
