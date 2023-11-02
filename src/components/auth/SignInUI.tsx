import React, { type FC } from 'react';
import { KeyboardAvoidingView, Linking, Platform } from 'react-native';

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import styled from 'styled-components/native';

import { SecondaryButton, Text } from '@components/ui';

import i18n from '@translations/i18n';
import { WEB_URL } from '@utils/sendRequest';

import { SignInForm } from './common-components';

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
  loading: boolean;
  hasError: boolean;
  onSignIn: (username: string, password: string) => void;
};

const SignInUI: FC<Props> = ({ loading, hasError, onSignIn }) => {
  const goToForgotPassword = (): void => {
    Linking.openURL(`${WEB_URL}/forgot-password`);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
      <Wrapper entering={FadeIn.duration(500)} exiting={FadeOut.duration(250)}>
        <Title>{i18n.t('signIn.title')}</Title>
        <SignInForm loading={loading} hasError={hasError} onSignIn={onSignIn} />
        <Separator />
        <ForgotPasswordButton
          label={i18n.t('signIn.buttons.forgotPassword')}
          onPress={goToForgotPassword}
        />
      </Wrapper>
    </KeyboardAvoidingView>
  );
};

export default SignInUI;
