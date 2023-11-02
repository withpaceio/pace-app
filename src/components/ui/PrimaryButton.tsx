import React, { type FC } from 'react';
import { Pressable, type PressableProps } from 'react-native';

import styled from 'styled-components/native';

import Text from './Text';
import { useTheme } from '../../theme';
import type { IconProps } from '../icons';

const PrimaryButtonWrapper = styled.View<{ disabled: PressableProps['disabled'] }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: ${({ disabled, theme }) =>
    disabled
      ? theme.colors.buttons.primary.disabled.background
      : theme.colors.buttons.primary.enabled.background};

  padding: 12px;
  border-radius: 3px;
`;

const PrimaryButtonLabel = styled(Text)`
  color: ${({ disabled, theme }) =>
    disabled
      ? theme.colors.buttons.primary.disabled.color
      : theme.colors.buttons.primary.enabled.color};
`;

const IconWrapper = styled.View`
  margin-right: ${({ theme }) => theme.sizes.button.icon.marginRight}px;
`;

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  Icon?: FC<IconProps>;
};

const PrimaryButton: FC<Props> = ({ label, disabled, Icon, ...props }) => {
  const theme = useTheme();

  return (
    <Pressable disabled={disabled} {...props}>
      <PrimaryButtonWrapper disabled={disabled}>
        {Icon && (
          <IconWrapper>
            <Icon
              width={theme.sizes.button.icon.width}
              height={theme.sizes.button.icon.height}
              color={theme.colors.white}
            />
          </IconWrapper>
        )}
        <PrimaryButtonLabel disabled={Boolean(disabled)}>{label}</PrimaryButtonLabel>
      </PrimaryButtonWrapper>
    </Pressable>
  );
};

export default PrimaryButton;
