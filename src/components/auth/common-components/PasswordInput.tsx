import React, { type FC, useCallback, useState } from 'react';
import {
  type NativeSyntheticEvent,
  Pressable,
  type TextInputFocusEventData,
  type TextInputProps,
} from 'react-native';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { CrossedEyeIcon, EyeIcon } from '@components/icons';
import { Text } from '@components/ui';

const Wrapper = styled.View<{ isFocused: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.sizes.innerPadding}px;
  margin-top: ${({ theme }) => theme.sizes.innerPadding / 2}px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background-color: ${({ isFocused, theme }) =>
    isFocused
      ? theme.colors.textInput.focused.background
      : theme.colors.textInput.unfocused.background};

  border-width: 1px;
  border-color: ${({ isFocused, theme }) =>
    isFocused ? theme.colors.textInput.focused.border : theme.colors.textInput.unfocused.border};
  border-radius: 4px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  margin-right: ${({ theme }) => theme.sizes.innerPadding / 2}px;

  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
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

const PasswordInput: FC<Props> = ({ caption, editable, onBlur, onFocus, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const theme = useTheme();

  const onBlurHandler = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>): void => {
      setIsFocused(false);

      if (onBlur) {
        onBlur(event);
      }
    },
    [onBlur],
  );

  const onFocusHandler = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>): void => {
      setIsFocused(true);

      if (onFocus) {
        onFocus(event);
      }
    },
    [onFocus],
  );

  const togglePasswordVisibility = useCallback((): void => {
    setIsPasswordHidden((prevIsPasswordHidden) => !prevIsPasswordHidden);
  }, []);

  return (
    <>
      <Wrapper isFocused={isFocused}>
        <StyledInput
          {...props}
          placeholderTextColor={theme.colors.textInput.placeholderTextColor}
          editable={editable}
          onBlur={onBlurHandler}
          onFocus={onFocusHandler}
          secureTextEntry={isPasswordHidden || !editable}
        />
        {editable && (
          <Pressable onPress={togglePasswordVisibility}>
            {isPasswordHidden ? (
              <EyeIcon color={theme.colors.secondary} width={18} height={18} />
            ) : (
              <CrossedEyeIcon color={theme.colors.secondary} width={18} height={18} />
            )}
          </Pressable>
        )}
      </Wrapper>
      {caption && <Caption>{caption}</Caption>}
    </>
  );
};

export default PasswordInput;
