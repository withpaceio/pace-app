import React, { type FC } from 'react';
import { useWindowDimensions } from 'react-native';

import { useSharedValue } from 'react-native-reanimated';

import { type ActivityLocation, ActivityType } from '@models/Activity';

import useSplitPaceChartData from '../common/SplitPaceChart/hooks/useSplitPaceChartData';
import type { ChartsProps } from '../types';
import PaceChart from './PaceChart';
import SplitPaceChart from './SplitPaceChart';

type Props = Pick<ChartsProps, 'summary' | 'locations' | 'distanceMeasurementSystem'>;

const RunningCharts: FC<Props> = ({ summary, locations, distanceMeasurementSystem }) => {
  const { width: windowWidth } = useWindowDimensions();

  const { splits, paceScale } = useSplitPaceChartData({
    activityType: ActivityType.RUNNING,
    chartWidth: windowWidth,
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
