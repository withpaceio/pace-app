import React, { type FC, forwardRef } from 'react';
import { Pressable, type PressableProps, View } from 'react-native';

import styled from 'styled-components/native';

import { useTheme } from '../../theme';
import { IconProps } from '../icons';
import Text from './Text';

const SecondaryButtonWrapper = styled.View<{ disabled: PressableProps['disabled'] }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: ${({ disabled, theme }) =>
    disabled
      ? theme.colors.buttons.secondary.disabled.background
      : theme.colors.buttons.secondary.enabled.background};

  padding: 12px;

  border-width: 1px;
  border-color: ${({ disabled, theme }) =>
    disabled
      ? theme.colors.buttons.secondary.disabled.border
      : theme.colors.buttons.secondary.enabled.border};
  border-style: solid;
  border-radius: 3px;
`;

const SecondaryButtonLabel = styled(Text)`
  color: ${({ disabled, theme }) =>
    disabled
      ? theme.colors.buttons.secondary.disabled.color
      : theme.colors.buttons.secondary.enabled.color};
`;

const IconWrapper = styled.View`
  margin-right: ${({ theme }) => theme.sizes.button.icon.marginRight}px;
`;

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  Icon?: FC<IconProps>;
};

const SecondaryButton = forwardRef<View, Props>(({ label, disabled, Icon, ...props }, ref) => {
  const theme = useTheme();

  return (
    <Pressable ref={ref} disabled={disabled} {...props}>
      <SecondaryButtonWrapper disabled={disabled}>
        {Icon && (
          <IconWrapper>
            <Icon
              width={theme.sizes.button.icon.width}
              height={theme.sizes.button.icon.height}
              color={
                disabled
                  ? theme.colors.buttons.secondary.disabled.color
                  : theme.colors.buttons.secondary.enabled.color
              }
            />
          </IconWrapper>
        )}
        <SecondaryButtonLabel disabled={Boolean(disabled)}>{label}</SecondaryButtonLabel>
      </SecondaryButtonWrapper>
    </Pressable>
  );
});

SecondaryButton.displayName = 'SecondaryButton';

export default SecondaryButton;
