import React, { type FC } from 'react';
import type { PressableProps } from 'react-native';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { CloseIcon } from '@components/icons';

import HeaderButton from './HeaderButton';

const Wrapper = styled.View`
  margin-left: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const CancelHeaderButton: FC<PressableProps> = ({ disabled, ...headerButtonProps }) => {
  const theme = useTheme();

  return (
    <Wrapper>
      <HeaderButton disabled={disabled} {...headerButtonProps}>
        <CloseIcon color={disabled ? theme.colors.secondary : theme.colors.primary} />
      </HeaderButton>
    </Wrapper>
  );
};

export default CancelHeaderButton;
