import type { ActivityType } from './Activity';
import type { DistanceMeasurementSystem } from './UnitSystem';

export type Preferences = {
  id: string;
  measurement: DistanceMeasurementSystem;
  defaultActivityType: ActivityType;
};
