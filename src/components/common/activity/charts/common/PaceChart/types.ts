import type { SharedValue } from 'react-native-reanimated';

import type { Histogram } from '@activity';

import type { ActivityType } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import useChartData from './hooks/useChartData';

export type ChartCursorProps = {
  x: SharedValue<number>;
  isActive: SharedValue<boolean>;
  activityType: ActivityType;
  chartWidth: number;
  timeScale: ReturnType<typeof useChartData>['distanceScale'];
  distanceScale: ReturnType<typeof useChartData>['distanceScale'];
  paceHistogram: Histogram;
  paceScale: ReturnType<typeof useChartData>['paceScale'];
  elevationHistogram: Histogram;
  elevationScale: ReturnType<typeof useChartData>['elevationScale'];
  distanceMeasurementSystem: DistanceMeasurementSystem;
};
