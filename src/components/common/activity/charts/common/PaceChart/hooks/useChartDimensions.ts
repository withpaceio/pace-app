import { useMemo } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { useTheme } from '@theme';

export default function useChartDimensions(): {
  chartWidth: number;
  chartHeight: number;
  yTop: number;
} {
  const { width: windowWidth } = useWindowDimensions();

  const theme = useTheme();

  const yTop = useMemo(
    () =>
      theme.sizes.paceChart.height -
      theme.sizes.paceChart.tickBarHeight -
      theme.sizes.paceChart.tickLabelSize,
    [
      theme.sizes.paceChart.height,
      theme.sizes.paceChart.tickBarHeight,
      theme.sizes.paceChart.tickLabelSize,
    ],
  );

  return {
    chartWidth: windowWidth * (Platform.OS === 'web' ? 0.6 : 1),
    chartHeight: theme.sizes.paceChart.height,
    yTop,
  };
}
