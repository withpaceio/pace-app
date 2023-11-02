import React, { type FC, useMemo } from 'react';
import { Animated } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { BackArrowIcon } from '@components/icons';

const ICON_SIZE = 30;

const Wrapper = styled.TouchableOpacity<{
  safeMarginTop: number;
}>`
  position: absolute;

  top: ${({ safeMarginTop, theme }) => safeMarginTop + theme.sizes.innerPadding}px;
  left: ${({ theme }) => theme.sizes.innerPadding}px;

  padding: ${({ theme }) => theme.sizes.innerPadding}px;
  border-radius: 15px;
`;

const AnimatedBackground = styled(Animated.View)<object>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  border-radius: 15px;

  background-color: ${({ theme }) => (theme.dark ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)')};
`;

type Props = {
  yScroll: Animated.Value;
  imageHeight: number;
  onPress: () => void;
};

const BackButton: FC<Props> = ({ yScroll, imageHeight, onPress }) => {
  const { top: marginTop } = useSafeAreaInsets();
  const theme = useTheme();

  const backgroundOpacityAnimated = useMemo(
    () =>
      yScroll.interpolate({
        inputRange: [0, imageHeight],
        outputRange: [0.7, 0],
        extrapolate: 'clamp',
      }),
    [imageHeight, yScroll],
  );

  return (
    <Wrapper safeMarginTop={marginTop} onPress={onPress}>
      <AnimatedBackground
        style={{
          opacity: backgroundOpacityAnimated,
        }}
      />
      <BackArrowIcon
        color={theme.dark ? theme.colors.white : theme.colors.black}
        width={ICON_SIZE}
        height={ICON_SIZE}
      />
    </Wrapper>
  );
};

export default BackButton;
