import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

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

  return { chartWidth: windowWidth, chartHeight: theme.sizes.paceChart.height, yTop };
}
