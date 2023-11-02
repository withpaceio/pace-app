import { ActivityType } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

export type ChangeDisplayPreferencesData = {
  unit: DistanceMeasurementSystem;
};

export type ChangeDefaultActivityTypeData = {
  defaultActivityType: ActivityType;
};

export type ChangePasswordFormData = {
  oldPassword: string;
  newPassword: string;
  passwordStrength: number;
  confirmNewPassword: string;
};

export type RecoveryEmailFormData = {
  email: string;
};
