import type { Activity } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

export type SummaryProps = {
  activity: Activity;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  formattedDistance: string;
  formattedDuration: string;
};
