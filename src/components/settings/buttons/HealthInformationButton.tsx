import React, { type FC, useCallback, useMemo } from 'react';

import { useRouter } from 'expo-router';

import { differenceInYears } from 'date-fns';

import { convertKilogramsToPounds } from '@activity';
import { useTheme } from '@theme';

import useHealthInformation from '@api/healthInformation/useHealthInformation';
import usePreferences from '@api/preferences/usePreferences';

import { UserIcon } from '@components/icons';
import { ActivityIndicator } from '@components/ui';

import { DistanceMeasurementSystem } from '@models/UnitSystem';

import i18n from '@translations/i18n';

import {
  ConfigureWrapper,
  EntryWrapper,
  ICON_SIZE,
  IconWrapper,
  Label,
  SecondaryLabel,
} from './common';

const HealthInformationButton: FC = () => {
  const { data: healthInformationData, isFetching: isFetchingHealthInformation } =
    useHealthInformation();
  const { data: preferencesData, isFetching: isFetchingPreferences } = usePreferences();

  const router = useRouter();
  const theme = useTheme();

  const label = useMemo(() => {
    if (!healthInformationData) {
      return i18n.t('settings.configureHealthInformation.notConfigured');
    }

    const ageLabel = `${differenceInYears(
      new Date(),
      new Date(healthInformationData.healthInformation.birthDate),
    )} ${i18n.t('settings.configureHealthInformation.yearsOld')}`;

    const weightLabel =
      preferencesData?.measurement === DistanceMeasurementSystem.METRIC
        ? `${Math.round(healthInformationData.healthInformation.weight)} kg`
        : `${Math.round(
            convertKilogramsToPounds(healthInformationData.healthInformation.weight),
          )} lbs`;

    return `${i18n.t(
      `settings.configureHealthInformation.inputs.gender.${healthInformationData.healthInformation.gender}`,
    )}, ${ageLabel}, ${weightLabel}`;
  }, [healthInformationData, preferencesData?.measurement]);

  const onConfigureHealthInformation = useCallback((): void => {
    router.push('/settings/health-information');
  }, [router]);

  return (
    <EntryWrapper
      onPress={onConfigureHealthInformation}
      disabled={isFetchingHealthInformation || isFetchingPreferences}>
      <IconWrapper>
        <UserIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
      </IconWrapper>
      <ConfigureWrapper>
        <Label>{i18n.t('settings.buttons.healthInformation')}</Label>
        {isFetchingHealthInformation || isFetchingPreferences ? (
          <ActivityIndicator />
        ) : (
          <SecondaryLabel>{label}</SecondaryLabel>
        )}
      </ConfigureWrapper>
    </EntryWrapper>
  );
};

export default HealthInformationButton;
