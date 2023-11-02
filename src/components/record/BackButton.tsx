import React, { type FC } from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { BackArrowIcon } from '@components/icons';

const ICON_SIZE = 30;

const Wrapper = styled.TouchableOpacity<{ safeMarginTop: number }>`
  position: absolute;

  top: ${({ safeMarginTop, theme }) => safeMarginTop + theme.sizes.innerPadding}px;
  left: ${({ theme }) => theme.sizes.innerPadding}px;

  background-color: ${({ theme }) =>
    theme.dark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};

  padding: ${({ theme }) => theme.sizes.innerPadding}px;
  border-radius: 15px;
`;

type Props = {
  onPress: () => void;
};

const BackButton: FC<Props> = ({ onPress }) => {
  const { top: marginTop } = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <Wrapper safeMarginTop={marginTop} onPress={onPress}>
      <BackArrowIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
    </Wrapper>
  );
};

export default BackButton;
