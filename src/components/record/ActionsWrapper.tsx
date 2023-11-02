import React, { type FC, type PropsWithChildren } from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const Wrapper = styled.View<{ safeMarginBottom: number }>`
  position: absolute;
  left: ${({ theme }) => theme.sizes.outerPadding}px;
  right: ${({ theme }) => theme.sizes.outerPadding}px;
  bottom: ${({ safeMarginBottom, theme }) =>
    safeMarginBottom > 0 ? safeMarginBottom : theme.sizes.outerPadding}px;

  padding: ${({ theme }) => theme.sizes.outerPadding}px;
  border-radius: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) =>
    theme.dark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
`;

const ActionsWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { bottom: marginBottom } = useSafeAreaInsets();

  return <Wrapper safeMarginBottom={marginBottom}>{children}</Wrapper>;
};

export default ActionsWrapper;
