import { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { useTheme } from '@theme';

import { TOUCHABLE_AREA_WIDTH } from '../ChartCursor';

type Args = {
  x: SharedValue<number>;
};

export default function useCursorGestureStyle({ x }: Args): ReturnType<typeof useAnimatedStyle> {
  const {
    sizes: {
      paceChart: { height: chartHeight },
      outerPadding,
    },
  } = useTheme();

  return useAnimatedStyle(() => ({
    position: 'absolute',
    width: TOUCHABLE_AREA_WIDTH,
    height: chartHeight,
    left: x.value - TOUCHABLE_AREA_WIDTH / 2,
    top: 2 * outerPadding,
  }));
}
