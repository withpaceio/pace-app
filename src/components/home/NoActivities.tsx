import React, { type FC } from 'react';

import styled from 'styled-components/native';

import { Text } from '@components/ui';

import i18n from '@translations/i18n';

import NatureIllustration from './NatureIllustration';

const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: 15%;
`;

const WelcomeText = styled(Text)`
  font-size: 30px;
  font-weight: bold;
  text-align: center;

  margin-top: ${({ theme }) => 2 * theme.sizes.outerPadding}px;
`;

const RecordText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  text-align: center;

  margin-top: ${({ theme }) => 2 * theme.sizes.outerPadding}px;
  margin-left: 25px;
  margin-right: 25px;

  padding: 30px;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.colors.componentBackground};
`;

type Props = {
  username: string;
  isLoading: boolean;
};

const NoActivities: FC<Props> = ({ username, isLoading }) => {
  if (isLoading) {
    return null;
  }

  return (
    <Wrapper>
      <NatureIllustration />
      <WelcomeText>{i18n.t('home.welcome', { username })}</WelcomeText>
      <RecordText>{i18n.t('home.noActivities')}</RecordText>
    </Wrapper>
  );
};

export default NoActivities;
