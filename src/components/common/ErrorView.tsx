import React, { type FC } from 'react';

import styled from 'styled-components/native';

import i18n from '@translations/i18n';

const Wrapper = styled.View`
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.red};

  font-size: 16px;
  font-weight: bold;
`;

type Props = {
  message?: string;
};

const ErrorView: FC<Props> = ({ message }) => (
  <Wrapper>
    <ErrorText>{message || i18n.t('errorView.defaultErrorMessage')}</ErrorText>
  </Wrapper>
);

export default ErrorView;
