import React, { type FC } from 'react';

import styled from 'styled-components/native';

import { StopIcon } from '@components/icons';

const ICON_SIZE = 30;

const Wrapper = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 50px;
  height: 50px;
  border-radius: 25px;

  padding-left: 2px;
  padding-top: 2px;

  background-color: ${({ disabled, theme }) =>
    disabled ? theme.colors.lightRed : theme.colors.red};
`;

type Props = {
  disabled?: boolean;
  onPress?: () => void;
};

const StopButton: FC<Props> = ({ disabled, onPress }) => (
  <Wrapper disabled={disabled} onPress={onPress}>
    <StopIcon width={ICON_SIZE} height={ICON_SIZE} />
  </Wrapper>
);

export default StopButton;
