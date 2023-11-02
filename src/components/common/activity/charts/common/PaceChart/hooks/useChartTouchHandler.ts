import { useMemo } from 'react';

import { Gesture, type PanGesture } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';

import { TOUCHABLE_AREA_WIDTH } from '../ChartCursor';

type Args = {
  x: SharedValue<number>;
  active: SharedValue<boolean>;
};

export default function useChartTouchHandler({ x, active }: Args): PanGesture {
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          active.value = true;
        })
        .onChange(({ x: xPosition }) => {
          x.value += xPosition - TOUCHABLE_AREA_WIDTH / 2;
        })
        .onEnd(() => {
          active.value = false;
        }),
    [active, x],
  );

  return gesture;
}
