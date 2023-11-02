import React, { type FC } from 'react';

import {
  Canvas,
  DashPathEffect,
  Group,
  Line,
  LinearGradient,
  Path,
  Text,
  useFont,
  vec,
} from '@shopify/react-native-skia';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  type SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';

import type { Split } from '@activity';
import { useTheme } from '@theme';

import type { ActivityLocation, ActivityType } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import ChartCursor from './ChartCursor';
import useChartData from './hooks/useChartData';
import useChartDimensions from './hooks/useChartDimensions';
import useChartTouchHandler from './hooks/useChartTouchHandler';
import useCursorGestureStyle from './hooks/useCursorGestureStyle';
import useSplitsData from './hooks/useSplitsData';

const robotoFont = require('../../../../../../../assets/fonts/roboto/Roboto-Regular.ttf');

const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  padding-top: ${({ theme }) => theme.sizes.outerPadding}px;

  background-color: ${({ theme }) => theme.colors.background};
`;

const StyledCanvas = styled(Canvas)`
  width: 100%;
  height: ${({ theme }) => theme.sizes.paceChart.height + 2 * theme.sizes.outerPadding}px;

  background-color: ${({ theme }) => theme.colors.background};
`;

type Props = {
  activityType: ActivityType;
  duration: number;
  averagePace: number;
  locations: ActivityLocation[];
  distanceMeasurementSystem: DistanceMeasurementSystem;
  splits: Split[];
  invertSplitPathRendering: boolean;
  currentHighlightedSplit: SharedValue<number>;
  previousHighlightedSplit: SharedValue<number>;
  splitPathsTransition: SharedValue<number>;
};

const PaceChart: FC<Props> = ({
  activityType,
  duration,
  averagePace,
  locations,
  distanceMeasurementSystem,
  splits,
  invertSplitPathRendering,
  currentHighlightedSplit,
  previousHighlightedSplit,
  splitPathsTransition,
}) => {
  const font = useFont(robotoFont);
  const theme = useTheme();

  const { chartWidth } = useChartDimensions();
  const {
    timeScale,
    paceHistogram,
    pacePath,
    paceBackgroundPath,
    paceScale,
    yAveragePace,
    elevationHistogram,
    elevationPath,
    elevationBackgroundPath,
    elevationScale,
    elevationTicks,
    distanceScale,
    distanceTicks,
    cumulativeRawSpeedData,
  } = useChartData({
    activityType,
    chartWidth,
    duration,
    averagePace,
    locations,
    distanceMeasurementSystem,
  });

  const {
    highlightedSplitPath: highlightedPaceSplitPath,
    highlightedSplitOpacity: highlightedPaceSplitOpacity,
  } = useSplitsData({
    invertYAxis: invertSplitPathRendering,
    splits,
    histogram: paceHistogram,
    scale: paceScale,
    cumulativeRawData: cumulativeRawSpeedData,
    currentHighlightedSplit,
    previousHighlightedSplit,
    splitPathsTransition,
  });

  const {
    highlightedSplitPath: highlightedElevationSplitPath,
    highlightedSplitOpacity: highlightedElevationSplitOpacity,
  } = useSplitsData({
    invertYAxis: false,
    splits,
    histogram: elevationHistogram,
    scale: elevationScale,
    cumulativeRawData: cumulativeRawSpeedData,
    currentHighlightedSplit,
    previousHighlightedSplit,
    splitPathsTransition,
  });

  const xCursor = useSharedValue(chartWidth / 2);
  const activeCursor = useSharedValue(false);
  const gesture = useChartTouchHandler({ x: xCursor, active: activeCursor });
  const cursorGestureStyle = useCursorGestureStyle({ x: xCursor });

  const paceLineOpacity = useDerivedValue(
    () => withTiming(currentHighlightedSplit.value !== -1 ? 0.25 : 1),
    [currentHighlightedSplit],
  );

  return (
    <Wrapper>
      <StyledCanvas>
        <Group transform={[{ translateY: theme.sizes.outerPadding }]}>
          <Path path={elevationBackgroundPath!} opacity={0.7}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, theme.sizes.paceChart.height)}
              colors={[
                theme.colors.activityDetails.paceChart.elevation.fill,
                theme.colors.background,
              ]}
            />
          </Path>
          <Path path={paceBackgroundPath!} opacity={0.7}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, theme.sizes.paceChart.height)}
              colors={[theme.colors.purple, theme.colors.background]}
            />
          </Path>
          <Path
            path={elevationPath!}
            style="stroke"
            strokeWidth={1}
            color={theme.colors.activityDetails.paceChart.elevation.stroke}
            opacity={paceLineOpacity}
          />
          <Path
            path={pacePath!}
            style="stroke"
            strokeWidth={1}
            color={theme.colors.purple}
            opacity={paceLineOpacity}
          />
          <Line
            p1={vec(0, yAveragePace)}
            p2={vec(chartWidth, yAveragePace)}
            color={theme.colors.primary}
            style="stroke"
            strokeWidth={1}>
            <DashPathEffect intervals={[2, 2]} />
          </Line>
          {distanceTicks.map(({ label, x: xTick }, index) => (
            <Text
              key={xTick}
              x={index === 0 ? 3 : xTick - font?.getTextWidth(label)! / 2}
              y={theme.sizes.paceChart.height + 15}
              font={font}
              text={label}
              color={theme.colors.primary}
            />
          ))}
          {elevationTicks.map(({ label, y }) => (
            <Text
              key={y}
              x={chartWidth - 40}
              y={y}
              font={font}
              text={label}
              color={theme.colors.activityDetails.paceChart.elevation.tickLabelColor}
            />
          ))}
          <Path
            path={highlightedPaceSplitPath}
            style="stroke"
            strokeWidth={2}
            color={theme.colors.purple}
            opacity={highlightedPaceSplitOpacity}
          />
          <Path
            path={highlightedElevationSplitPath}
            style="stroke"
            strokeWidth={2}
            color={theme.colors.activityDetails.paceChart.elevation.stroke}
            opacity={highlightedElevationSplitOpacity}
          />
          <ChartCursor
            x={xCursor}
            isActive={activeCursor}
            activityType={activityType}
            chartWidth={chartWidth}
            timeScale={timeScale}
            distanceScale={distanceScale}
            paceHistogram={paceHistogram}
            paceScale={paceScale}
            elevationHistogram={elevationHistogram}
            elevationScale={elevationScale}
            distanceMeasurementSystem={distanceMeasurementSystem}
          />
        </Group>
      </StyledCanvas>
      <GestureDetector gesture={gesture}>
        <Animated.View style={cursorGestureStyle} />
      </GestureDetector>
    </Wrapper>
  );
};

export default PaceChart;
