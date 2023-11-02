import React, { type FC } from 'react';

import type { SharedValue } from 'react-native-reanimated';

import type { Split } from '@activity';

import { type ActivityLocation, ActivityType } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import GenericPaceChart from '../common/PaceChart';

type Props = {
  duration: number;
  averageSpeed: number;
  locations: ActivityLocation[];
  distanceMeasurementSystem: DistanceMeasurementSystem;
  splits: Split[];
  currentHighlightedSplit: SharedValue<number>;
  previousHighlightedSplit: SharedValue<number>;
  splitPathsTransition: SharedValue<number>;
};

const SpeedChart: FC<Props> = ({
  duration,
  averageSpeed,
  locations,
  distanceMeasurementSystem,
  splits,
  currentHighlightedSplit,
  previousHighlightedSplit,
  splitPathsTransition,
}) => (
  <GenericPaceChart
    activityType={ActivityType.CYCLING}
    duration={duration}
    averagePace={averageSpeed}
    locations={locations}
    distanceMeasurementSystem={distanceMeasurementSystem}
    splits={splits}
    invertSplitPathRendering={false}
    currentHighlightedSplit={currentHighlightedSplit}
    previousHighlightedSplit={previousHighlightedSplit}
    splitPathsTransition={splitPathsTransition}
  />
);

export default SpeedChart;
