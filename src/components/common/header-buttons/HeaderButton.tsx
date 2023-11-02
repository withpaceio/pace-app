import React, { type FC, type ReactNode } from 'react';
import { Pressable, PressableProps } from 'react-native';

import styled from 'styled-components/native';

const Wrapper = styled.View<{ pressed: boolean }>`
  margin-right: ${({ theme }) => theme.sizes.innerPadding}px;
  opacity: ${({ pressed }) => (pressed ? 0.1 : 1)};
`;

type Props = PressableProps & {
  children: ReactNode;
};

const HeaderButton: FC<Props> = ({ children, ...props }) => (
  <Pressable {...props}>
    {({ pressed }) => <Wrapper pressed={pressed}>{children}</Wrapper>}
  </Pressable>
);

export default HeaderButton;
