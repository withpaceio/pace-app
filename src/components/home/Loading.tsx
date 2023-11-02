import React, { FC } from 'react';

import styled from 'styled-components/native';

import { ActivityIndicator } from '../ui';

const Wrapper = styled.View<{ initialLoading: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
  ${({ initialLoading, theme }) =>
    initialLoading && `margin-top: ${2 * theme.sizes.outerPadding}px;`}
`;

type Props = {
  isLoading: boolean;
  initialLoading: boolean;
};

const Loading: FC<Props> = ({ isLoading, initialLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <Wrapper initialLoading={initialLoading}>
      <ActivityIndicator size={initialLoading ? 'large' : 'small'} />
    </Wrapper>
  );
};

export default Loading;
