import { useMemo } from 'react';

import { Gesture, type TapGesture } from 'react-native-gesture-handler';
import { type SharedValue, withTiming } from 'react-native-reanimated';

import type { Split } from '@activity';
import { useTheme } from '@theme';

type Args = {
  splits: Split[];
  currentHighlightedSplit: SharedValue<number>;
  previousHighlightedSplit: SharedValue<number>;
  splitPathsTransition: SharedValue<number>;
};

export default function useSplitChartTouchHandler({
  splits,
  currentHighlightedSplit,
  previousHighlightedSplit,
  splitPathsTransition,
}: Args): TapGesture {
  const {
    sizes: {
      splitChart: { barHeight, barMarginBottom },
    },
  } = useTheme();

  const chartHeight = useMemo(
    () => splits.length * (barHeight + barMarginBottom),
    [barHeight, barMarginBottom, splits],
  );

  const gesture = useMemo(
    () =>
      Gesture.Tap().onStart(({ y: yPosition }) => {
        previousHighlightedSplit.value = currentHighlightedSplit.value;

        const touchedSplitIndex = Math.floor((yPosition / chartHeight) * splits.length);
        currentHighlightedSplit.value =
          touchedSplitIndex === currentHighlightedSplit.value ? -1 : touchedSplitIndex;

        splitPathsTransition.value = 0;
        splitPathsTransition.value = withTiming(1, { duration: 750 });
      }),
    [chartHeight, currentHighlightedSplit, previousHighlightedSplit, splits, splitPathsTransition],
  );

  return gesture;
}
