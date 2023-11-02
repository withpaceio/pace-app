import React, { type FC, type ReactElement } from 'react';

import styled from 'styled-components/native';

const Wrapper = styled.TouchableOpacity<{ disabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 70px;
  height: 70px;
  border-radius: 35px;

  background-color: ${({ disabled, theme }) =>
    disabled ? theme.colors.lightPurple : theme.colors.purple};

  shadow-color: ${({ theme }) => theme.colors.black};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.22;
  shadow-radius: 2.22px;
  elevation: 3;
`;

type Props = {
  Icon: ReactElement;
  onPress: () => void;
  disabled?: boolean;
};

const ActionButton: FC<Props> = ({ Icon, onPress, disabled }) => (
  <Wrapper onPress={onPress} disabled={disabled ?? false}>
    {Icon}
  </Wrapper>
);

export default ActionButton;
