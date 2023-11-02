import React, { type FC, useMemo } from 'react';

import { Group, Rect, RoundedRect, Text, rect, rrect, useFont } from '@shopify/react-native-skia';
import { type SharedValue, useDerivedValue, withTiming } from 'react-native-reanimated';

import { type Split as SplitType, formatElevation, formatPace, formatSpeed } from '@activity';
import { useTheme } from '@theme';

import { ActivityType } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import useSplitPaceChartData from './hooks/useSplitPaceChartData';

const robotoRegularFont = require('../../../../../../../assets/fonts/roboto/Roboto-Regular.ttf');

type Props = {
  activityType: ActivityType;
  split: SplitType;
  splitIndex: number;
  splitLengthInMeters: number;
  currentHighlightedSplit: SharedValue<number>;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  paceScale: ReturnType<typeof useSplitPaceChartData>['paceScale'];
  chartWidth: number;
};

const Split: FC<Props> = ({
  activityType,
  split: { distance, elevation, pace },
  splitIndex,
  splitLengthInMeters,
  currentHighlightedSplit,
  distanceMeasurementSystem,
  paceScale,
  chartWidth,
}) => {
  const font = useFont(robotoRegularFont, 15);
  const {
    colors: {
      background,
      primary,
      purple,
      activityDetails: {
        splitPaceChart: { highlightedFill, splitFill },
      },
    },
    sizes: {
      innerPadding,
      splitChart: { barHeight, barMarginBottom, barRoundedRadius, splitValueWidth },
    },
  } = useTheme();

  const splitDistanceText = useMemo(
    () =>
      distance < splitLengthInMeters / 1000
        ? distance.toString()
        : ((splitIndex + 1) * distance).toString(),
    [distance, splitIndex, splitLengthInMeters],
  );

  const splitPaceText = useMemo(
    () =>
      activityType === ActivityType.RUNNING
        ? formatPace(pace, distanceMeasurementSystem, true)
        : formatSpeed(pace, distanceMeasurementSystem, true),
    [activityType, distanceMeasurementSystem, pace],
  );

  const backgroundColor = useDerivedValue(
    () => withTiming(splitIndex === currentHighlightedSplit.value ? highlightedFill : background),
    [currentHighlightedSplit, splitIndex, highlightedFill, background],
  );

  const foregroundColor = useDerivedValue(
    () => withTiming(splitIndex === currentHighlightedSplit.value ? purple : splitFill),
    [currentHighlightedSplit, splitIndex, purple, splitFill],
  );

  const textColor = useDerivedValue(
    () => withTiming(splitIndex === currentHighlightedSplit.value ? purple : primary),
    [currentHighlightedSplit, splitIndex, primary, purple],
  );

  return (
    <Group
      key={`${distance}-${pace}-${elevation}`}
      transform={[
        {
          translateY: splitIndex * (barHeight + barMarginBottom),
        },
      ]}>
      <Rect rect={rect(0, 0, chartWidth, barHeight)} color={backgroundColor} />
      <Text x={innerPadding * 1.5} y={16} text={splitDistanceText} font={font} color={textColor} />
      <Text
        x={splitValueWidth + innerPadding}
        y={16}
        text={splitPaceText}
        font={font}
        color={textColor}
      />
      <Text
        x={2 * splitValueWidth + innerPadding}
        y={16}
        text={formatElevation(elevation, distanceMeasurementSystem, true)}
        font={font}
        color={textColor}
      />
      <RoundedRect
        rect={rrect(
          rect(
            3 * splitValueWidth + innerPadding,
            barMarginBottom / 2,
            paceScale.apply(pace),
            barHeight - barMarginBottom,
          ),
          barRoundedRadius,
          barRoundedRadius,
        )}
        color={foregroundColor}
      />
    </Group>
  );
};

export default Split;
