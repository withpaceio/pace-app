import React, { type FC, useCallback } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import styled from 'styled-components/native';
import { number, object, ref, string } from 'yup';

import { useTheme } from '@theme';

import { CheckIcon, CloseIcon } from '@components/icons';
import { ActivityIndicator, PasswordStrengthBar, Text, TextInput } from '@components/ui';

import i18n from '@translations/i18n';

import { FormButton, FormErrorText, PasswordInput } from './common-components';

const Wrapper = styled(Animated.View)`
  flex: 1;

  margin-top: ${({ theme }) => 3 * theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const Title = styled(Text)`
  font-weight: bold;
  font-size: 20px;
  text-align: center;

  padding-bottom: ${({ theme }) => 2 * theme.sizes.outerPadding}px;
`;

const UsernameWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  max-width: 100%;
`;

const UsernameInputWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  flex-shrink: 1;

  width: 100%;
`;

const UsernameInput = styled(TextInput)`
  flex-shrink: 1;
  margin-right: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const UsernameAvailabilityWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 34px;
  height: 34px;

  margin-left: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const ErrorText = styled(Text)`
  width: 100%;
  color: ${({ theme }) => theme.colors.red};
`;

const PasswordStrengthBarWrapper = styled.View`
  width: 100%;

  margin-top: ${({ theme }) => theme.sizes.innerPadding / 2}px;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding / 2}px;
`;

const schema = object().shape({
  username: string()
    .min(3, i18n.t('signUp.inputs.username.tooShort'))
    .required(i18n.t('signUp.inputs.username.error')),
  password: string().required(i18n.t('signUp.inputs.password.error')),
  passwordStrength: number().min(4, i18n.t('signUp.inputs.passwordStrength.error')),
  confirmPassword: string()
    .oneOf([ref('password'), null], i18n.t('signUp.inputs.confirmPassword.notMatching'))
    .required(i18n.t('signUp.inputs.confirmPassword.notMatching')),
});

type FormData = {
  username: string;
  email: string;
  password: string;
  passwordStrength: number;
  confirmPassword: string;
};

type Props = {
  usernameAvailable: boolean;
  loadingUsernameAvailability: boolean;
  loading: boolean;
  hasError: boolean;
  onCheckUsernameAvailability: (username: string) => Promise<void>;
  onSignUp: (username: string, password: string) => void;
};

const SignUpUI: FC<Props> = ({
  usernameAvailable,
  loadingUsernameAvailability,
  loading,
  hasError,
  onCheckUsernameAvailability,
  onSignUp,
}) => {
  const { control, getValues, handleSubmit, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const password = watch('password');
  const theme = useTheme();

  const onBlurUsername = useCallback((): void => {
    const { username } = getValues();
    onCheckUsernameAvailability(username);
  }, [getValues, onCheckUsernameAvailability]);

  const onSubmit = useCallback(
    ({ username, password: formPassword }: FormData): void => {
      onSignUp(username, formPassword);
    },
    [onSignUp],
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
      <Wrapper entering={FadeIn.duration(500)} exiting={FadeOut.duration(250)}>
        <Title>{i18n.t('signUp.title')}</Title>
        <UsernameWrapper>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <UsernameInputWrapper>
                <UsernameInput
                  placeholder={i18n.t('signUp.inputs.username.placeholder')}
                  value={value}
                  editable={!loading}
                  caption={error?.message}
                  onBlur={() => {
                    onBlurUsername();
                    onBlur();
                  }}
                  onChangeText={onChange}
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              </UsernameInputWrapper>
            )}
            name="username"
            rules={{ required: true }}
            defaultValue=""
          />
          <UsernameAvailabilityWrapper>
            {loadingUsernameAvailability && <ActivityIndicator />}
            {!loadingUsernameAvailability && usernameAvailable && (
              <CheckIcon color={theme.colors.green} />
            )}
            {!loadingUsernameAvailability && !usernameAvailable && (
              <CloseIcon color={theme.colors.red} />
            )}
          </UsernameAvailabilityWrapper>
        </UsernameWrapper>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <PasswordInput
              placeholder={i18n.t('signUp.inputs.password.placeholder')}
              value={value}
              editable={!loading}
              autoComplete="password"
              caption={error?.message}
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={handleSubmit(onSubmit)}
              secureTextEntry
            />
          )}
          name="password"
          rules={{ required: true }}
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange }, fieldState: { error } }) => (
            <>
              <PasswordStrengthBarWrapper>
                <PasswordStrengthBar password={password} onScoreChanged={onChange} />
              </PasswordStrengthBarWrapper>
              <ErrorText>{error?.message}</ErrorText>
            </>
          )}
          name="passwordStrength"
          rules={{ required: true }}
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <PasswordInput
              placeholder={i18n.t('signUp.inputs.confirmPassword.placeholder')}
              value={value}
              editable={!loading}
              autoComplete="password"
              caption={error?.message}
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={handleSubmit(onSubmit)}
              secureTextEntry
            />
          )}
          name="confirmPassword"
          rules={{ required: true }}
          defaultValue=""
        />
        <FormButton
          label={i18n.t('signUp.buttons.signUp')}
          onPress={handleSubmit(onSubmit)}
          disabled={loading || loadingUsernameAvailability || !usernameAvailable}
        />
        {hasError && <FormErrorText>{i18n.t('signUp.errors.failed')}</FormErrorText>}
      </Wrapper>
    </KeyboardAvoidingView>
  );
};

export default SignUpUI;
