import React, { type FC } from 'react';

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import styled from 'styled-components/native';

import { PrimaryButton, SecondaryButton } from '@components/ui';

import i18n from '@translations/i18n';

const Wrapper = styled(Animated.View)`
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: ${({ theme }) => 6 * theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const CreateAccountButton = styled(PrimaryButton)`
  width: 100%;
`;

const SignInButton = styled(SecondaryButton)`
  width: 100%;
  margin-top: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = {
  onCreateAccountPress: () => void;
  onSignInPress: () => void;
};

const LandingUI: FC<Props> = ({ onCreateAccountPress, onSignInPress }) => (
  <Wrapper entering={FadeIn.duration(500)} exiting={FadeOut.duration(250)}>
    <CreateAccountButton
      label={i18n.t('onboarding.buttons.signUp')}
      onPress={onCreateAccountPress}
    />
    <SignInButton label={i18n.t('onboarding.buttons.signIn')} onPress={onSignInPress} />
  </Wrapper>
);

export default LandingUI;
