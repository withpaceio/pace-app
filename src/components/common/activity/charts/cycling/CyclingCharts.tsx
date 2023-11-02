import React, { type FC } from 'react';
import { useWindowDimensions } from 'react-native';

import { useSharedValue } from 'react-native-reanimated';

import { type ActivityLocation, ActivityType } from '@models/Activity';

import SpeedChart from './SpeedChart';
import SplitSpeedChart from './SplitSpeedChart';
import useSplitPaceChartData from '../common/SplitPaceChart/hooks/useSplitPaceChartData';
import type { ChartsProps } from '../types';

type Props = Pick<ChartsProps, 'summary' | 'locations' | 'distanceMeasurementSystem'>;

const CyclingCharts: FC<Props> = ({ summary, locations, distanceMeasurementSystem }) => {
  const { width: windowWidth } = useWindowDimensions();

  const { splits, paceScale } = useSplitPaceChartData({
    activityType: ActivityType.CYCLING,
    chartWidth: windowWidth,
    splitLengthInMeters: 5000,
    locations: locations as ActivityLocation[],
    distanceMeasurementSystem,
  });

  const currentHighlightedSplit = useSharedValue(-1);
  const previousHighlightedSplit = useSharedValue(-1);
  const splitPathsTransition = useSharedValue(-1);

  return (
    <>
      <SpeedChart
        duration={summary.duration}
        averageSpeed={summary.pace}
        locations={locations as ActivityLocation[]}
        distanceMeasurementSystem={distanceMeasurementSystem}
        splits={splits}
        currentHighlightedSplit={currentHighlightedSplit}
        previousHighlightedSplit={previousHighlightedSplit}
        splitPathsTransition={splitPathsTransition}
      />
      <SplitSpeedChart
        distanceMeasurementSystem={distanceMeasurementSystem}
        speedScale={paceScale}
        splits={splits}
        currentHighlightedSplit={currentHighlightedSplit}
        previousHighlightedSplit={previousHighlightedSplit}
        splitPathsTransition={splitPathsTransition}
      />
    </>
  );
};

export default CyclingCharts;
