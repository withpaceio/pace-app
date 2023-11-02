import React, { FC, ReactNode } from 'react';
import { Pressable } from 'react-native';

import styled from 'styled-components/native';

const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;

  margin-top: 15px;
`;

type Props = {
  onPress: () => void;
  children: ReactNode;
};

const LinkFooter: FC<Props> = ({ onPress, children }) => (
  <Pressable onPress={onPress}>
    <Wrapper>{children}</Wrapper>
  </Pressable>
);

export default LinkFooter;
