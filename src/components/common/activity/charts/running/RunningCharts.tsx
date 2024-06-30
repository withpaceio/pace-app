import React, { type FC } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { useSharedValue } from 'react-native-reanimated';

import { type ActivityLocation, ActivityType } from '@models/Activity';

import { useActivityCharts } from '../ActivityChartsProvider';
import useSplitPaceChartData from '../common/SplitPaceChart/hooks/useSplitPaceChartData';
import PaceChart from './PaceChart';
import SplitPaceChart from './SplitPaceChart';

const RunningCharts: FC = () => {
  const { locations, summary, distanceMeasurementSystem } = useActivityCharts();
  const { width: windowWidth } = useWindowDimensions();

  const { splits, paceScale } = useSplitPaceChartData({
    activityType: ActivityType.RUNNING,
    chartWidth: windowWidth * (Platform.OS === 'web' ? 0.6 : 1),
    splitLengthInMeters: 1000,
    locations: locations as ActivityLocation[],
    distanceMeasurementSystem,
  });

  const currentHighlightedSplit = useSharedValue(-1);
  const previousHighlightedSplit = useSharedValue(-1);
  const splitPathsTransition = useSharedValue(-1);

  return (
    <>
      <PaceChart
        averagePace={summary.pace}
        duration={summary.duration}
        locations={locations as ActivityLocation[]}
        distanceMeasurementSystem={distanceMeasurementSystem}
        splits={splits}
        currentHighlightedSplit={currentHighlightedSplit}
        previousHighlightedSplit={previousHighlightedSplit}
        splitPathsTransition={splitPathsTransition}
      />
      <SplitPaceChart
        distanceMeasurementSystem={distanceMeasurementSystem}
        paceScale={paceScale}
        splits={splits}
        currentHighlightedSplit={currentHighlightedSplit}
        previousHighlightedSplit={previousHighlightedSplit}
        splitPathsTransition={splitPathsTransition}
      />
    </>
  );
};

export default RunningCharts;
