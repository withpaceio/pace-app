import React, { type FC } from 'react';
import { Pressable, type PressableProps } from 'react-native';

import styled from 'styled-components/native';

import Text from './Text';
import { useTheme } from '../../theme';
import { IconProps } from '../icons';

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

const SecondaryButton: FC<Props> = ({ label, disabled, Icon, ...props }) => {
  const theme = useTheme();

  return (
    <Pressable disabled={disabled} {...props}>
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
};

export default SecondaryButton;
