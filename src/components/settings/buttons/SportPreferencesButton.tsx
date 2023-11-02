import React, { type FC, useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@theme';

import usePreferences from '@api/preferences/usePreferences';

import { FlagIcon } from '@components/icons';
import { ActivityIndicator } from '@components/ui';

import { ActivityType } from '@models/Activity';
import Screens from '@navigation/screens';
import type { SettingsScreenProps } from '@navigation/types';
import i18n from '@translations/i18n';

import {
  ConfigureWrapper,
  EntryWrapper,
  ICON_SIZE,
  IconWrapper,
  Label,
  SecondaryLabel,
} from './common';

const SportPreferencesButton: FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<SettingsScreenProps['navigation']>();

  const { data: preferencesData, isFetching } = usePreferences();

  const onChangeDefaultActivityType = useCallback((): void => {
    navigation.navigate(Screens.CHANGE_DEFAULT_ACTIVTY_TYPE);
  }, [navigation]);

  return (
    <EntryWrapper onPress={onChangeDefaultActivityType}>
      <IconWrapper>
        <FlagIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
      </IconWrapper>
      <ConfigureWrapper>
        <Label>{i18n.t('settings.buttons.defaultActivityType')}</Label>
        {isFetching ? (
          <ActivityIndicator />
        ) : (
          <SecondaryLabel>
            {i18n.t(
              `settings.defaultActivityType.activityTypes.${(
                preferencesData?.defaultActivityType || ActivityType.RUNNING
              ).toLowerCase()}`,
            )}
          </SecondaryLabel>
        )}
      </ConfigureWrapper>
    </EntryWrapper>
  );
};

export default SportPreferencesButton;
