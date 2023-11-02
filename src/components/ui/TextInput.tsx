import React, { type FC, useState } from 'react';
import type { NativeSyntheticEvent, TextInputFocusEventData, TextInputProps } from 'react-native';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import Text from './Text';

const StyledTextInput = styled.TextInput<{ isFocused?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.sizes.innerPadding}px;

  font-family: 'Roboto-Regular';
  font-size: 14px;

  background-color: ${({ isFocused, theme }) =>
    isFocused
      ? theme.colors.textInput.focused.background
      : theme.colors.textInput.unfocused.background};

  color: ${({ theme }) => theme.colors.primary};

  border-width: 1px;
  border-color: ${({ isFocused, theme }) =>
    isFocused ? theme.colors.textInput.focused.border : theme.colors.textInput.unfocused.border};
  border-radius: 4px;
`;

const Caption = styled(Text)`
  width: 100%;

  margin-top: 2px;
  margin-bottom: 3px;
  text-align: left;

  color: ${({ theme }) => theme.colors.red};
`;

type Props = TextInputProps & {
  caption?: string;
};

const TextInput: FC<Props> = ({ caption, onBlur, onFocus, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  const theme = useTheme();

  const onBlurHandler = (event: NativeSyntheticEvent<TextInputFocusEventData>): void => {
    setIsFocused(false);

    if (onBlur) {
      onBlur(event);
    }
  };

  const onFocusHandler = (event: NativeSyntheticEvent<TextInputFocusEventData>): void => {
    setIsFocused(true);

    if (onFocus) {
      onFocus(event);
    }
  };

  return (
    <>
      {/* @ts-ignore */}
      <StyledTextInput
        {...props}
        placeholderTextColor={theme.colors.textInput.placeholderTextColor}
        isFocused={isFocused}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
      />
      {caption && <Caption>{caption}</Caption>}
    </>
  );
};

export default TextInput;
