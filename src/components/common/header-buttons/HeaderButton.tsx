import type { FC, ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';

import styled from 'styled-components/native';

const Wrapper = styled.View<{ pressed: boolean }>`
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
