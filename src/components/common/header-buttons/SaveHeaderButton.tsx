import React, { type FC } from 'react';
import type { PressableProps } from 'react-native';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { CheckIcon } from '@components/icons';

import HeaderButton from './HeaderButton';

const Wrapper = styled.View`
  margin-right: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const SaveHeaderButton: FC<PressableProps> = ({ disabled, ...headerButtonProps }) => {
  const theme = useTheme();

  if (disabled) {
    return null;
  }

  return (
    <Wrapper>
      <HeaderButton disabled={disabled} {...headerButtonProps}>
        <CheckIcon color={theme.colors.purple} />
      </HeaderButton>
    </Wrapper>
  );
};

export default SaveHeaderButton;
