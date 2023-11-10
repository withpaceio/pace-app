import { type FC } from 'react';
import type { PressableProps } from 'react-native';

import { useTheme } from '@theme';

import { CheckIcon } from '@components/icons';

import HeaderButton from './HeaderButton';

const SaveHeaderButton: FC<PressableProps> = ({ disabled, ...headerButtonProps }) => {
  const theme = useTheme();

  if (disabled) {
    return null;
  }

  return (
    <HeaderButton disabled={disabled} {...headerButtonProps}>
      <CheckIcon color={theme.colors.purple} />
    </HeaderButton>
  );
};

export default SaveHeaderButton;
