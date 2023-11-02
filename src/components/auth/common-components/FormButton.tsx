import React, { type FC } from 'react';
import type { TouchableOpacityProps } from 'react-native';

import styled from 'styled-components/native';

const FormButtonLabel = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-family: 'Roboto-Regular';
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;

const FormButtonWrapper = styled.TouchableOpacity`
  background-color: ${({ disabled, theme }) =>
    disabled
      ? theme.colors.buttons.primary.disabled.background
      : theme.colors.buttons.primary.enabled.background};
  color: ${({ disabled, theme }) =>
    disabled
      ? theme.colors.buttons.primary.disabled.color
      : theme.colors.buttons.primary.enabled.color};

  width: 100%;
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
  padding: 12px;

  border-radius: 3px;
`;

type Props = TouchableOpacityProps & {
  label: string;
};

const FormButton: FC<Props> = ({ label, ...props }) => (
  <FormButtonWrapper {...props}>
    <FormButtonLabel>{label}</FormButtonLabel>
  </FormButtonWrapper>
);

export default FormButton;
