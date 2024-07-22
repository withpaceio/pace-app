import React, { type FC } from 'react';
import { useWindowDimensions } from 'react-native';

import { useSharedValue } from 'react-native-reanimated';

import { type ActivityLocation, ActivityType } from '@models/Activity';

import { useActivityCharts } from '../ActivityChartsProvider';
import useSplitPaceChartData from '../common/SplitPaceChart/hooks/useSplitPaceChartData';
import SpeedChart from './SpeedChart';
import SplitSpeedChart from './SplitSpeedChart';

const CyclingCharts: FC = () => {
  const { locations, summary, distanceMeasurementSystem } = useActivityCharts();
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
