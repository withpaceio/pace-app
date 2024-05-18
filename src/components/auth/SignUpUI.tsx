import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { useRouter } from 'expo-router';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import styled from 'styled-components/native';
import { number, object, ref, string } from 'yup';

import { useTheme } from '@theme';

import useIsUsernameAvailable from '@api/auth/useIsUsernameAvailable';
import useSignIn from '@api/auth/useSignIn';
import useSignUp from '@api/auth/useSignUp';

import { CheckIcon, CloseIcon } from '@components/icons';
import { ActivityIndicator, PasswordStrengthBar, Text, TextInput } from '@components/ui';

import i18n from '@translations/i18n';

import SigningProgressModal from './SigningProgressModal';
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
  passwordStrength: number()
    .min(4, i18n.t('signUp.inputs.passwordStrength.tooWeak'))
    .required('signUp.inputs.passwordStrength.error'),
  confirmPassword: string()
    .oneOf([ref('password'), undefined], i18n.t('signUp.inputs.confirmPassword.notMatching'))
    .required(i18n.t('signUp.inputs.confirmPassword.notMatching')),
});

type FormData = {
  username: string;
  password: string;
  passwordStrength: number;
  confirmPassword: string;
};

type Props = {
  onLoadingChanged: (loading: boolean) => void;
};

const SignUpUI: FC<Props> = ({ onLoadingChanged }) => {
  const router = useRouter();

  const [usernameToCheck, setUsernameToCheck] = useState<string>();
  const theme = useTheme();

  const { control, handleSubmit, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const username = watch('username');
  const password = watch('password');

  const {
    data: isUsernameAvailableData,
    fetchStatus: usernameFetchStatus,
    isLoading: isUsernameLoading,
  } = useIsUsernameAvailable(usernameToCheck);
  const { mutate: signIn, isPending: isSignInLoading, isError: isSignInError } = useSignIn();
  const { mutate: signUp, isPending: isSignUpLoading, isError: isSignUpError } = useSignUp();

  const loadingUsernameAvailability = useMemo(
    () => usernameFetchStatus === 'fetching' && isUsernameLoading,
    [isUsernameLoading, usernameFetchStatus],
  );

  const usernameAvailable = useMemo(
    () =>
      (isUsernameAvailableData && isUsernameAvailableData.isAvailable) ||
      (!isUsernameAvailableData && usernameFetchStatus === 'idle'),
    [isUsernameAvailableData, usernameFetchStatus],
  );

  const onBlurUsername = useCallback((): void => {
    setUsernameToCheck(username);
  }, [username]);

  const onSubmit = useCallback(
    ({ username, password: formPassword }: FormData): void => {
      signUp(
        { username, password: formPassword },
        {
          onSuccess: () => {
            signIn(
              { username, password: formPassword },
              {
                onSuccess: () => {
                  router.replace('/');
                },
              },
            );
          },
        },
      );
    },
    [router, signIn, signUp],
  );

  useEffect(() => {
    onLoadingChanged(isSignInLoading || isSignUpLoading);
  }, [isSignInLoading, isSignUpLoading, onLoadingChanged]);

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
                  editable={!isSignInLoading && !isSignUpLoading}
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
              editable={!isSignInLoading && !isSignUpLoading}
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
              editable={!isSignInLoading && !isSignUpLoading}
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
          disabled={
            isSignInLoading || isSignUpLoading || loadingUsernameAvailability || !usernameAvailable
          }
        />
        {(isSignInError || isSignUpError) && (
          <FormErrorText>{i18n.t('signUp.errors.failed')}</FormErrorText>
        )}
      </Wrapper>
      <SigningProgressModal
        title={i18n.t('signUp.loadingLabel')}
        visible={isSignUpLoading || isSignInLoading}
      />
    </KeyboardAvoidingView>
  );
};

export default SignUpUI;
