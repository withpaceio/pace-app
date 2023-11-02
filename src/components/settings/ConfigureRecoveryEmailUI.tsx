import React, { type FC } from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { WarningIcon } from '@components/icons';
import { ActivityIndicator, Text, TextInput } from '@components/ui';

import i18n from '@translations/i18n';

const Wrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const SavingAndErrorWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
`;

const SavingText = styled(Text)`
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
  font-size: 16px;
`;

const ErrorText = styled(SavingText)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.red};
`;

type FormData = {
  email: string;
};

type Props = {
  saving: boolean;
  hasError: boolean;
  onSave: (data: FormData) => void;
};

const ConfigureRecoveryEmailUI: FC<Props> = ({ saving, hasError, onSave }) => {
  const { control, handleSubmit } = useFormContext<FormData>();

  const theme = useTheme();

  return (
    <Wrapper>
      <Controller
        control={control}
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
          <TextInput
            placeholder={i18n.t('settings.recoveryEmail.inputPlaceholder')}
            value={value}
            caption={error?.message}
            editable={!saving}
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={handleSubmit(onSave)}
          />
        )}
        name="email"
        rules={{ required: true }}
      />
      {hasError && (
        <SavingAndErrorWrapper>
          <WarningIcon color={theme.colors.red} />
          <ErrorText>{i18n.t('settings.errors.failureMessage')}</ErrorText>
          <ErrorText>{i18n.t('settings.errors.retry')}</ErrorText>
        </SavingAndErrorWrapper>
      )}
      {saving && (
        <SavingAndErrorWrapper>
          <ActivityIndicator size="large" />
          <SavingText>{i18n.t('settings.saving')}</SavingText>
        </SavingAndErrorWrapper>
      )}
    </Wrapper>
  );
};

export default ConfigureRecoveryEmailUI;
