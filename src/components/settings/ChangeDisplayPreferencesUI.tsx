import React, { type FC } from 'react';

import Checkbox from 'expo-checkbox';

import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import SavingModal from '@components/common/SavingModal';
import { Text } from '@components/ui';

import { DistanceMeasurementSystem } from '@models/UnitSystem';

import i18n from '@translations/i18n';

import type { ChangeDisplayPreferencesData } from './types';

const Wrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const Title = styled(Text)`
  font-size: 16px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const SystemMeasurementWrapper = styled.Pressable<{ isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  border-width: ${({ isSelected }) => (isSelected ? 2 : 1)}px;
  border-color: ${({ theme }) => theme.colors.purple};
  border-radius: 10px;

  padding: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const Label = styled(Text)`
  font-size: 16px;
  margin-left: ${({ theme }) => theme.sizes.innerPadding}px;
`;

type Props = {
  isSaving: boolean;
  hasError: boolean;
  onSubmit: () => void;
  onDiscard: () => void;
};

const ChangeDisplayPreferencesUI: FC<Props> = ({ isSaving, hasError, onSubmit, onDiscard }) => {
  const { control } = useFormContext<ChangeDisplayPreferencesData>();
  const theme = useTheme();

  return (
    <Wrapper>
      <Title>{i18n.t('settings.changeDisplayPreferences.inputs.systemOfMeasurement.label')}</Title>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <SystemMeasurementWrapper
              isSelected={value === DistanceMeasurementSystem.IMPERIAL}
              onPress={() => onChange(DistanceMeasurementSystem.IMPERIAL)}>
              <Checkbox
                value={value === DistanceMeasurementSystem.IMPERIAL}
                color={
                  value === DistanceMeasurementSystem.IMPERIAL
                    ? theme.colors.purple
                    : theme.colors.separatorColor
                }
                onValueChange={() => onChange(DistanceMeasurementSystem.IMPERIAL)}
              />
              <Label>{i18n.t('settings.changeDisplayPreferences.units.imperial')}</Label>
            </SystemMeasurementWrapper>
            <SystemMeasurementWrapper
              isSelected={value === DistanceMeasurementSystem.METRIC}
              onPress={() => onChange(DistanceMeasurementSystem.METRIC)}>
              <Checkbox
                value={value === DistanceMeasurementSystem.METRIC}
                color={
                  value === DistanceMeasurementSystem.METRIC
                    ? theme.colors.purple
                    : theme.colors.separatorColor
                }
                onValueChange={() => onChange(DistanceMeasurementSystem.METRIC)}
              />
              <Label>{i18n.t('settings.changeDisplayPreferences.units.metric')}</Label>
            </SystemMeasurementWrapper>
          </>
        )}
        name="unit"
        rules={{ required: true }}
      />
      <SavingModal
        title={i18n.t('settings.changeDisplayPreferences.savingModal.title')}
        errorMessage={i18n.t('settings.changeDisplayPreferences.savingModal.error')}
        saving={isSaving}
        hasError={hasError}
        retryLabel={i18n.t('settings.changeDisplayPreferences.savingModal.buttons.retry')}
        discardLabel={i18n.t('settings.changeDisplayPreferences.savingModal.buttons.discard')}
        onRetry={onSubmit}
        onDiscard={onDiscard}
      />
    </Wrapper>
  );
};

export default ChangeDisplayPreferencesUI;
