import React, { type FC } from 'react';

import type { SharedValue } from 'react-native-reanimated';

import type { Split as SplitType } from '@activity';

import { ActivityType } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';
import i18n from '@translations/i18n';

import type { Scale } from '../common/PaceChart/hooks/useScaleLinear';
import GenericSplitPaceChart from '../common/SplitPaceChart';

type Props = {
  distanceMeasurementSystem: DistanceMeasurementSystem;
  speedScale: Scale;
  splits: SplitType[];
  currentHighlightedSplit: SharedValue<number>;
  previousHighlightedSplit: SharedValue<number>;
  splitPathsTransition: SharedValue<number>;
};

const SplitSpeedChart: FC<Props> = ({
  distanceMeasurementSystem,
  speedScale,
  splits,
  currentHighlightedSplit,
  previousHighlightedSplit,
  splitPathsTransition,
}) => (
  <GenericSplitPaceChart
    activityType={ActivityType.CYCLING}
    title={i18n.t('activityDetails.splits')}
    paceLabel={i18n.t('activityDetails.speed')}
    distanceMeasurementSystem={distanceMeasurementSystem}
    paceScale={speedScale}
    splits={splits}
    currentHighlightedSplit={currentHighlightedSplit}
    previousHighlightedSplit={previousHighlightedSplit}
    splitPathsTransition={splitPathsTransition}
    splitLengthInMeters={5000}
  />
);

export default SplitSpeedChart;
