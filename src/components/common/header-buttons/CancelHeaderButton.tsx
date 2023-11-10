import { type FC } from 'react';
import type { PressableProps } from 'react-native';

import { useTheme } from '@theme';

import { CloseIcon } from '@components/icons';

import HeaderButton from './HeaderButton';

const CancelHeaderButton: FC<PressableProps> = ({ disabled, ...headerButtonProps }) => {
  const theme = useTheme();

  return (
    <HeaderButton disabled={disabled} {...headerButtonProps}>
      <CloseIcon color={disabled ? theme.colors.secondary : theme.colors.primary} />
    </HeaderButton>
  );
};

export default CancelHeaderButton;
