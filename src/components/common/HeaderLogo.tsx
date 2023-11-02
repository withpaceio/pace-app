import React, { type FC } from 'react';

import styled from 'styled-components/native';

import { PaceIcon } from '@components/icons';
import { Text } from '@components/ui';

const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 100%;
`;

const HeaderText = styled(Text)`
  font-family: 'Roboto-BlackItalic';
  font-size: 70px;
  letter-spacing: -8px;
`;

const HeaderLogo: FC = () => (
  <Wrapper>
    <PaceIcon />
    <HeaderText>PACE</HeaderText>
  </Wrapper>
);

export default HeaderLogo;
