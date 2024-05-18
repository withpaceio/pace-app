import React, { type FC } from 'react';

import Checkbox from 'expo-checkbox';

import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { Text } from '@components/ui';

import type { HealthInformation } from '@models/HealthInformation';

import i18n from '@translations/i18n';

const Wrapper = styled.View`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const GenderPickerWrapper = styled.Pressable<{ isSelected: boolean }>`
  width: 100%;

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

const GenderLabel = styled(Text)`
  margin-left: ${({ theme }) => theme.sizes.innerPadding}px;
  font-size: 16px;
`;

const Error = styled(Text)`
  width: 100%;
  color: ${({ theme }) => theme.colors.red};
  text-align: left;
`;

const GenderAttribute: FC = () => {
  const { control } = useFormContext<HealthInformation>();
  const theme = useTheme();

  return (
    <Controller
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Wrapper>
          <GenderPickerWrapper isSelected={value === 'male'} onPress={() => onChange('male')}>
            <Checkbox
              value={value === 'male'}
              color={value === 'male' ? theme.colors.purple : theme.colors.separatorColor}
              onValueChange={() => onChange('male')}
            />
            <GenderLabel>
              {i18n.t('settings.configureHealthInformation.inputs.gender.male')}
            </GenderLabel>
          </GenderPickerWrapper>
          <GenderPickerWrapper isSelected={value === 'female'} onPress={() => onChange('female')}>
            <Checkbox
              value={value === 'female'}
              color={value === 'female' ? theme.colors.purple : theme.colors.separatorColor}
              onValueChange={() => onChange('female')}
            />
            <GenderLabel>
              {i18n.t('settings.configureHealthInformation.inputs.gender.female')}
            </GenderLabel>
          </GenderPickerWrapper>
          <GenderPickerWrapper
            isSelected={value === 'non-binary'}
            onPress={() => onChange('non-binary')}>
            <Checkbox
              value={value === 'non-binary'}
              color={value === 'non-binary' ? theme.colors.purple : theme.colors.separatorColor}
              onValueChange={() => onChange('non-binary')}
            />
            <GenderLabel>
              {i18n.t('settings.configureHealthInformation.inputs.gender.non-binary')}
            </GenderLabel>
          </GenderPickerWrapper>
          {error && <Error>{error.message}</Error>}
        </Wrapper>
      )}
      name="gender"
      rules={{ required: true }}
    />
  );
};

export default GenderAttribute;
