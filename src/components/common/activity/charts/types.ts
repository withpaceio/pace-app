import type { ActivityLocation, ActivitySummary } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

export type ChartsProps = {
  summary: Omit<ActivitySummary, 'name' | 'updatedAt'> & { name?: string };
  locations: ActivityLocation[] | null | undefined;
  locationsFetching: boolean;
  locationsError: boolean;
  distanceMeasurementSystem: DistanceMeasurementSystem;
};

export type ChartsContextValue = Pick<
  ChartsProps,
  'summary' | 'locations' | 'distanceMeasurementSystem'
>;
