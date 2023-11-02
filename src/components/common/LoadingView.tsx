import React, { FC } from 'react';

import styled from 'styled-components/native';

import { ActivityIndicator } from '@components/ui';

const Wrapper = styled.View`
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoadingView: FC = () => (
  <Wrapper>
    <ActivityIndicator size="large" />
  </Wrapper>
);

export default LoadingView;
