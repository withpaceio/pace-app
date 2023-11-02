import type { ActivityLocation, ActivitySummary } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

export type ActivityStatisticsProps = {
  summary: Omit<ActivitySummary, 'name' | 'createdAt' | 'updatedAt'>;
  locations: ActivityLocation[] | null | undefined;
  distanceMeasurementSystem: DistanceMeasurementSystem;
};
