import React, { type FC } from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components/native';

import { PasswordInput } from '@components/auth/common-components';
import SavingModal from '@components/common/SavingModal';
import { PasswordStrengthBar, Text } from '@components/ui';

import i18n from '@translations/i18n';

import type { ChangePasswordFormData } from './types';

const Wrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const PasswordStrengthBarWrapper = styled.View`
  width: 100%;

  margin-top: ${({ theme }) => theme.sizes.innerPadding / 2}px;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding / 2}px;
`;

const PasswordWeakText = styled(Text)`
  width: 100%;

  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
  text-align: left;

  color: ${({ theme }) => theme.colors.red};
`;

type Props = {
  saving: boolean;
  hasFailedAuth: boolean;
  hasError: boolean;
  onSubmitNewPassword: (newPasswords: ChangePasswordFormData) => Promise<void>;
  onDiscard: () => void;
};

const ChangePasswordUI: FC<Props> = ({
  saving,
  hasFailedAuth,
  hasError,
  onSubmitNewPassword,
  onDiscard,
}) => {
  const { control, handleSubmit, watch } = useFormContext<ChangePasswordFormData>();

  const newPassword = watch('newPassword');

  return (
    <Wrapper>
      <Controller
        control={control}
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
          <PasswordInput
            placeholder={i18n.t('settings.changePassword.inputs.oldPassword.placeholder')}
            value={value}
            caption={error?.message}
            editable={!saving}
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={handleSubmit(onSubmitNewPassword)}
            secureTextEntry
          />
        )}
        name="oldPassword"
        defaultValue=""
        rules={{ required: true }}
      />
      <Controller
        control={control}
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
          <PasswordInput
            placeholder={i18n.t('settings.changePassword.inputs.newPassword.placeholder')}
            value={value}
            caption={error?.message}
            editable={!saving}
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={handleSubmit(onSubmitNewPassword)}
            secureTextEntry
          />
        )}
        name="newPassword"
        defaultValue=""
        rules={{ required: true }}
      />
      <Controller
        control={control}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <>
            <PasswordStrengthBarWrapper>
              <PasswordStrengthBar password={newPassword} onScoreChanged={onChange} />
            </PasswordStrengthBarWrapper>
            <PasswordWeakText>{error?.message}</PasswordWeakText>
          </>
        )}
        name="passwordStrength"
        rules={{ required: true }}
      />
      <Controller
        control={control}
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
          <PasswordInput
            placeholder={i18n.t('settings.changePassword.inputs.confirmNewPassword.placeholder')}
            value={value}
            caption={error?.message}
            editable={!saving}
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={handleSubmit(onSubmitNewPassword)}
            secureTextEntry
          />
        )}
        name="confirmNewPassword"
        defaultValue=""
        rules={{ required: true }}
      />
      <SavingModal
        title={i18n.t('settings.changePassword.savingModal.title')}
        errorMessage={
          hasFailedAuth
            ? i18n.t('settings.changePassword.savingModal.failedAuthError')
            : i18n.t('settings.changePassword.savingModal.error')
        }
        saving={saving}
        hasError={hasError || hasFailedAuth}
        retryLabel={i18n.t('settings.changePassword.savingModal.buttons.retry')}
        discardLabel={i18n.t('settings.changePassword.savingModal.buttons.discard')}
        onRetry={handleSubmit(onSubmitNewPassword)}
        onDiscard={onDiscard}
      />
    </Wrapper>
  );
};

export default ChangePasswordUI;
