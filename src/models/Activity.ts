export type ActivitySummary = {
  name: string;
  type: ActivityType;
  distance: number;
  duration: number;
  pace: number;
  calories?: number;
  createdAt: string;
  updatedAt: string;
};

export type Activity = {
  id: string;
  userId: string;
  encryptionKey: string;
  locationsFilePath?: string;
  mapFileLocation: string;
  summary: ActivitySummary;
  createdAt: string;
  toSync?: boolean;
};

export type EncryptedActivity = Omit<Activity, 'encryptionKey' | 'summary'> & {
  encryptionKey: string;
  summary: string;
};

export type ActivityDate = {
  id: string;
  createdAt: string;
  encryptionKey: string;
};

export enum ActivityType {
  // eslint-disable-next-line no-unused-vars
  RUNNING = 'RUNNING',
  // eslint-disable-next-line no-unused-vars
  CYCLING = 'CYCLING',
}

export type ActivityLocation = {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: number;
  segment?: number;
};

export type ActivityLocationDistance = ActivityLocation & {
  cumulativeDistance: number;
  pace: number;
};

export type ActivityTaskState = 'notStarted' | 'recording' | 'paused' | 'stopped';

export type NumberActivities = {
  running: number;
};

export type UploadActivityPayload = {
  id: string;
  summary: string;
  createdAt: string;
  hasLocations?: boolean;
  activityEncryptionKey: string;
};

export type CreateActivityResponse = {
  id: string;
};

export type DeleteActivityResponse = {
  id: string;
};

export type UpdateActivityResponse = {
  id: string;
};

export type UploadActivityResponse = {
  id: string;
  url: string;
  mapUrlDark: string;
  mapUrlLight: string;
};
