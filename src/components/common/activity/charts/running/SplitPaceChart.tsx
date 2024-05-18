import React, { type FC } from 'react';

import type { SharedValue } from 'react-native-reanimated';

import type { Split } from '@activity';

import { ActivityType } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import i18n from '@translations/i18n';

import type { Scale } from '../common/PaceChart/hooks/useScaleLinear';
import GenericSplitPaceChart from '../common/SplitPaceChart';

type Props = {
  distanceMeasurementSystem: DistanceMeasurementSystem;
  paceScale: Scale;
  splits: Split[];
  currentHighlightedSplit: SharedValue<number>;
  previousHighlightedSplit: SharedValue<number>;
  splitPathsTransition: SharedValue<number>;
};

const SplitPaceChart: FC<Props> = ({
  distanceMeasurementSystem,
  paceScale,
  splits,
  currentHighlightedSplit,
  previousHighlightedSplit,
  splitPathsTransition,
}) => (
  <GenericSplitPaceChart
    activityType={ActivityType.RUNNING}
    title={i18n.t('activityDetails.splits')}
    paceLabel={i18n.t('activityDetails.pace')}
    distanceMeasurementSystem={distanceMeasurementSystem}
    paceScale={paceScale}
    splits={splits}
    currentHighlightedSplit={currentHighlightedSplit}
    previousHighlightedSplit={previousHighlightedSplit}
    splitPathsTransition={splitPathsTransition}
    splitLengthInMeters={1000}
  />
);

export default SplitPaceChart;
