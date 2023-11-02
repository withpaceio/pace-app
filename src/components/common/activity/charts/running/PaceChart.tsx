import React, { type FC } from 'react';

import type { SharedValue } from 'react-native-reanimated';

import { Split } from '@activity';

import { ActivityLocation, ActivityType } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import GenericPaceChart from '../common/PaceChart';

type Props = {
  averagePace: number;
  duration: number;
  locations: ActivityLocation[];
  distanceMeasurementSystem: DistanceMeasurementSystem;
  splits: Split[];
  currentHighlightedSplit: SharedValue<number>;
  previousHighlightedSplit: SharedValue<number>;
  splitPathsTransition: SharedValue<number>;
};

const PaceChart: FC<Props> = ({
  averagePace,
  duration,
  locations,
  distanceMeasurementSystem,
  splits,
  currentHighlightedSplit,
  previousHighlightedSplit,
  splitPathsTransition,
}) => (
  <GenericPaceChart
    activityType={ActivityType.RUNNING}
    duration={duration}
    averagePace={averagePace}
    locations={locations}
    distanceMeasurementSystem={distanceMeasurementSystem}
    splits={splits}
    currentHighlightedSplit={currentHighlightedSplit}
    previousHighlightedSplit={previousHighlightedSplit}
    splitPathsTransition={splitPathsTransition}
    invertSplitPathRendering
  />
);

export default PaceChart;
