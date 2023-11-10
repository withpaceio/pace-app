import { type FC, useCallback, useEffect } from 'react';
import { KeyboardAvoidingView, Linking, Platform } from 'react-native';

import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import styled from 'styled-components/native';

import useSignIn from '@api/auth/useSignIn';

import { SecondaryButton, Text } from '@components/ui';

import i18n from '@translations/i18n';
import { WEB_URL } from '@utils/sendRequest';

import { SignInForm } from './common-components';
import SigningProgressModal from './SigningProgressModal';

const Wrapper = styled(Animated.View)`
  margin-top: ${({ theme }) => 3 * theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const ForgotPasswordButton = styled(SecondaryButton)`
  width: 100%;
  margin-top: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const Title = styled(Text)`
  font-weight: bold;
  font-size: 20px;
  text-align: center;

  padding-bottom: ${({ theme }) => 2 * theme.sizes.outerPadding}px;
`;

const Separator = styled.View`
  width: 100%;
  margin-top: ${({ theme }) => theme.sizes.outerPadding}px;
  border-color: ${({ theme }) => theme.colors.separatorColor};
  border-bottom-width: 1px;
`;

type Props = {
  onLoadingChanged: (loading: boolean) => void;
};

const SignInUI: FC<Props> = ({ onLoadingChanged }) => {
  const router = useRouter();

  const { mutate: signIn, isPending, isError } = useSignIn();

  const onSignIn = useCallback(
    (username: string, password: string): void => {
      signIn(
        { username, password },
        {
          onSuccess: () => {
            router.replace('/');
          },
        },
      );
    },
    [router, signIn],
  );

  const goToForgotPassword = useCallback((): void => {
    Linking.openURL(`${WEB_URL}/forgot-password`);
  }, []);

  useEffect(() => {
    onLoadingChanged(isPending);
  }, [isPending, onLoadingChanged]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
      <Wrapper entering={FadeIn.duration(500)} exiting={FadeOut.duration(250)}>
        <Title>{i18n.t('signIn.title')}</Title>
        <SignInForm loading={isPending} hasError={isError} onSignIn={onSignIn} />
        <Separator />
        <ForgotPasswordButton
          label={i18n.t('signIn.buttons.forgotPassword')}
          onPress={goToForgotPassword}
        />
      </Wrapper>
      <SigningProgressModal title={i18n.t('signIn.loadingLabel')} visible={isPending} />
    </KeyboardAvoidingView>
  );
};

export default SignInUI;
