import React, { type FC } from 'react';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { MapMarkerIcon } from '@components/icons';

const ICON_SIZE = 30;

const Wrapper = styled.TouchableOpacity`
  position: absolute;

  bottom: 295px;
  right: ${({ theme }) => theme.sizes.outerPadding}px;

  background-color: ${({ theme }) =>
    theme.dark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};

  padding: ${({ theme }) => theme.sizes.innerPadding}px;
  border-radius: 15px;
`;

type Props = {
  onPress: () => void;
};

const RecenterMapButton: FC<Props> = ({ onPress }) => {
  const theme = useTheme();

  return (
    <Wrapper onPress={onPress}>
      <MapMarkerIcon
        width={ICON_SIZE}
        height={ICON_SIZE}
        backgroundColor={theme.colors.background}
        color={theme.colors.primary}
      />
    </Wrapper>
  );
};

export default RecenterMapButton;
