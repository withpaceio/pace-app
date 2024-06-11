import React, { type FC } from 'react';
import { Platform } from 'react-native';

import styled from 'styled-components/native';

import { PaceIcon } from '../icons';
import SyncIndicator from './SyncIndicator';

const ICON_SIZE = 30;

const Wrapper = styled.View`
  position: relative;
  min-width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: ${Platform.OS === 'ios' ? 'center' : 'flex-start'};
  align-items: center;

  background-color: ${({ theme }) => theme.colors.navigation.backgroundColor};
`;

const PaceText = styled.Text`
  width: ${Platform.OS === 'ios' ? 'auto' : '100%'};

  margin-left: 3px;

  color: ${({ theme }) => theme.colors.primary};
  font-size: 30px;
  font-family: Roboto-BlackItalic;
  letter-spacing: -3px;
`;

const Header: FC = () => (
  <Wrapper>
    <PaceIcon width={ICON_SIZE} height={ICON_SIZE} />
    <PaceText>PACE</PaceText>
    <SyncIndicator />
  </Wrapper>
);

export default Header;
