import React, { type FC } from 'react';
import { Linking, Pressable } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import i18n from '@translations/i18n';

const Wrapper = styled.View<{ safeBottomMargin: number }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 100%;
  padding-top: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-bottom: ${({ safeBottomMargin, theme }) => safeBottomMargin + theme.sizes.outerPadding}px;

  background-color: ${({ theme }) => theme.colors.background};
  border-top-color: ${({ theme }) => theme.colors.separatorColor};
  border-top-width: 1px;
`;

const LinkText = styled.Text`
  color: ${({ theme }) => theme.colors.purple};
`;

const LinkAnd = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
`;

const Policies: FC = () => {
  const { bottom: safeBottomMargin } = useSafeAreaInsets();

  const openTermsOfUse = (): void => {
    Linking.openURL('https://withpace.io/terms-of-use');
  };

  const openPrivacyPolicy = (): void => {
    Linking.openURL('https://withpace.io/privacy-policy');
  };

  return (
    <Wrapper safeBottomMargin={safeBottomMargin}>
      <Pressable onPress={openTermsOfUse}>
        <LinkText>{i18n.t('onboarding.policies.termsOfUse')}</LinkText>
      </Pressable>
      <LinkAnd>{i18n.t('onboarding.policies.and')}</LinkAnd>
      <Pressable onPress={openPrivacyPolicy}>
        <LinkText>{i18n.t('onboarding.policies.privacyPolicy')}</LinkText>
      </Pressable>
    </Wrapper>
  );
};

export default Policies;
