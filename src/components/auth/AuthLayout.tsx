import React, { type FC, type ReactNode } from 'react';
import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import GradientView from '@components/common/GradientView';

const Wrapper = styled.KeyboardAvoidingView`
  flex: 1;
`;

const StyledGradientView = styled(GradientView)`
  flex: 1;
  justify-content: space-around;
  padding: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const FormWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  max-width: 500px;

  border-radius: 5px;

  padding: ${({ theme }) => theme.sizes.outerPadding}px;

  background-color: ${({ theme }) => theme.colors.background};

  shadow-color: ${({ theme }) => theme.colors.black};
  shadow-opacity: 0.25;
  shadow-radius: 10px;
  shadow-offset: 0px 4px;
  elevation: 3;
`;

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const theme = useTheme();

  return (
    <Wrapper behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <StyledGradientView colors={[theme.colors.purple, theme.colors.green]}>
          <FormWrapper>{children}</FormWrapper>
        </StyledGradientView>
      </TouchableWithoutFeedback>
    </Wrapper>
  );
};

export default AuthLayout;
