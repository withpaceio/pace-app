import {
  Accuracy,
  ActivityType,
  type LocationObject,
  hasStartedLocationUpdatesAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { getDistanceInKilometers, getFilteredLocations } from '@activity';

import { type ActivityLocation, ActivityType as PaceActivityType } from '@models/Activity';

import theme from '../theme/theme';

const RECORD_ACTIVITY_TASK_NAME = 'RECORD_ACTIVITY_TASK_NAME';

export type ActivityListener = (locations: LocationObject[]) => void;

export type RecordingListener = (recordingStatus: 'recording' | 'stopped') => void;

export default class Activity {
  private static instance: Activity;

  stopWatchId: number | null = null;

  locations: ActivityLocation[] = [];

  currentSegmentIndex = 0;

  startTimestamp = 0;

  endTimestamp = 0;

  distance = 0;

  listeners: ActivityListener[] = [];

  recordingListeners: RecordingListener[] = [];

  mapImageLight = '';

  mapImageDark = '';

  static getInstance(): Activity {
    if (!this.instance) {
      this.instance = new Activity();
    }

    return this.instance;
  }

  reset(): void {
    if (this.stopWatchId !== null) {
      clearInterval(this.stopWatchId);
    }

    this.locations.length = 0;
    this.currentSegmentIndex = 0;
    this.startTimestamp = 0;
    this.endTimestamp = 0;
    this.distance = 0;
    this.mapImageLight = '';
    this.mapImageDark = '';
  }

  addListener(listener: ActivityListener): void {
    this.listeners.push(listener);
  }

  removeListener(listener: ActivityListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  addRecordingListener(listener: RecordingListener): void {
    this.recordingListeners.push(listener);
  }

  removedRecordingListener(listener: RecordingListener): void {
    this.recordingListeners = this.recordingListeners.filter((l) => l !== listener);
  }

  async startRecording(activityType: PaceActivityType): Promise<void> {
    await startLocationUpdatesAsync(RECORD_ACTIVITY_TASK_NAME, {
      accuracy: Accuracy.BestForNavigation,
      activityType: ActivityType.Fitness,
      timeInterval: 1000,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'PACE',
        notificationBody:
          activityType === PaceActivityType.RUNNING ? 'Recording your run' : 'Recording your ride',
        notificationColor: theme.colors.purple,
      },
    });

    const now = Date.now();

    this.startTimestamp = now;
    this.endTimestamp = now;
    this.currentSegmentIndex = 0;

    this.recordingListeners.forEach((listener) => {
      listener('recording');
    });
  }

  async resumeRecording(activityType: PaceActivityType): Promise<void> {
    await startLocationUpdatesAsync(RECORD_ACTIVITY_TASK_NAME, {
      accuracy: Accuracy.BestForNavigation,
      activityType: ActivityType.Fitness,
      timeInterval: 1000,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'PACE',
        notificationBody:
          activityType === PaceActivityType.RUNNING ? 'Recording your run' : 'Recording your ride',
        notificationColor: theme.colors.purple,
      },
    });

    this.currentSegmentIndex += 1;

    this.recordingListeners.forEach((listener) => {
      listener('recording');
    });
  }

  async stopRecording(): Promise<void> {
    try {
      await stopLocationUpdatesAsync(RECORD_ACTIVITY_TASK_NAME);
    } catch {}

    this.recordingListeners.forEach((listener) => {
      listener('stopped');
    });
  }

  isRecording(): Promise<boolean> {
    return hasStartedLocationUpdatesAsync(RECORD_ACTIVITY_TASK_NAME);
  }
}

TaskManager.defineTask(RECORD_ACTIVITY_TASK_NAME, ({ data, error }) => {
  if (!data || error) {
    return;
  }

  const activity = Activity.getInstance();

  const { locations } = data as { locations: LocationObject[] };
  if (locations.length === 0) {
    return;
  }

  const previouslyRecordedLocation =
    activity.locations.length > 0 ? activity.locations[activity.locations.length - 1] : null;

  const filteredLocations = getFilteredLocations(
    [
      ...(previouslyRecordedLocation &&
      previouslyRecordedLocation.segment === activity.currentSegmentIndex
        ? [previouslyRecordedLocation]
        : []),
    ].concat(
      locations
        .filter(({ timestamp }) => timestamp >= activity.startTimestamp)
        .map(({ coords, timestamp }) => ({
          latitude: coords.latitude,
          longitude: coords.longitude,
          altitude: coords.altitude ?? 0,
          timestamp,
          segment: activity.currentSegmentIndex,
        })),
    ),
  );

  if (filteredLocations.length === 0) {
    return;
  }

  const lastRecordedLocation = filteredLocations[filteredLocations.length - 1];
  activity.endTimestamp = lastRecordedLocation.timestamp;

  if (filteredLocations.length > 0) {
    activity.distance += getDistanceInKilometers(filteredLocations);
  }

  let locationsToAdd = [];
  if (previouslyRecordedLocation?.segment !== activity.currentSegmentIndex) {
    locationsToAdd = filteredLocations;
  } else if (activity.locations.length > 0) {
    const [, ...newLocations] = filteredLocations;
    locationsToAdd = newLocations;
  } else {
    locationsToAdd = filteredLocations;
  }

  activity.locations.push(...locationsToAdd);

  activity.listeners.forEach((listener) => {
    listener(locations);
  });
});
