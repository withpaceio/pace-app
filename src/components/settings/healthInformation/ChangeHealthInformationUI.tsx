import React, { type FC } from 'react';
import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';

import { useFormContext } from 'react-hook-form';
import styled from 'styled-components/native';

import { Text } from '@components/ui';

import type { HealthInformation } from '@models/HealthInformation';
import type { Preferences } from '@models/Preferences';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import i18n from '@translations/i18n';

import BirthDatePicker from './BirthDatePicker';
import GenderAttribute from './GenderAttribute';
import SaveHealthInformationModal from './SaveHealthInformationModal';
import WeightAttribute from './WeightAttribute';

const KeyboardWrapper = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const Wrapper = styled.ScrollView`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.sizes.outerPadding}px;
  overflow: visible;
`;

const AttributeWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;

  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const Label = styled(Text)`
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding}px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  font-weight: bold;
`;

type Props = {
  preferences: Preferences | null | undefined;
  saving: boolean;
  hasError: boolean;
  onSubmitHealthInformation: (healthInformation: HealthInformation) => void;
  onDiscard: () => void;
};

const ChangeHealthInformationUI: FC<Props> = ({
  preferences,
  saving,
  hasError,
  onSubmitHealthInformation,
  onDiscard,
}) => {
  const { handleSubmit } = useFormContext<HealthInformation>();

  return (
    <>
      <KeyboardWrapper
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Wrapper>
            <AttributeWrapper>
              <Label>{i18n.t('settings.configureHealthInformation.inputs.gender.label')}</Label>
              <GenderAttribute />
            </AttributeWrapper>
            <AttributeWrapper>
              <Label>{i18n.t('settings.configureHealthInformation.inputs.birthDate.label')}</Label>
              <BirthDatePicker />
            </AttributeWrapper>
            <AttributeWrapper>
              <Label>
                {i18n.t('settings.configureHealthInformation.inputs.weight.label', {
                  unit:
                    !preferences || preferences?.measurement === DistanceMeasurementSystem.METRIC
                      ? 'kg'
                      : 'lbs',
                })}
              </Label>
              <WeightAttribute
                measurementSystem={preferences?.measurement || DistanceMeasurementSystem.METRIC}
                onSubmitHealthInformation={onSubmitHealthInformation}
              />
            </AttributeWrapper>
          </Wrapper>
        </TouchableWithoutFeedback>
      </KeyboardWrapper>
      <SaveHealthInformationModal
        saving={saving}
        hasError={hasError}
        onRetry={handleSubmit(onSubmitHealthInformation)}
        onDiscard={onDiscard}
      />
    </>
  );
};

export default ChangeHealthInformationUI;
