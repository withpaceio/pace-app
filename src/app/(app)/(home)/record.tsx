import { type FC, useCallback, useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import * as Battery from 'expo-battery';
import * as Location from 'expo-location';
import { useNavigation, useRouter } from 'expo-router';

import { useIsFocused } from '@react-navigation/native';

import useNumberActivities from '@api/activity/useNumberActivities';
import usePreferences from '@api/preferences/usePreferences';

import ReachedLimitFreePlanModal from '@components/record/ReachedLimitFreePlanModal';
import RecordUI from '@components/record/RecordUI';

import { type ActivityTaskState, ActivityType } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import useCurrentSubscription from '@subscription/useCurrentSubscription';

import ActivityTask from '@tasks/ActivityTask';

import { NUMBER_FREE_ACTIVITIES } from '../../../consts';

const RecordScreen: FC = () => {
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [errorStarting, setErrorStarting] = useState(false);
  const [hasBatteryOptimization, setHasBatteryOptimization] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType | null>(null);
  const [activityState, setActivityState] = useState<ActivityTaskState>('notStarted');

  const router = useRouter();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { currentSubscription, loading: subscriptionLoading } = useCurrentSubscription();

  const {
    data: numberActivitiesData,
    isFetching: isNumberActivitiesFetching,
    refetch: refetchNumberActivities,
  } = useNumberActivities();
  const { data: preferencesData, isFetching: isFetchingPreferences } = usePreferences();

  const activityTask = ActivityTask.getInstance();

  const goToHome = useCallback((): void => {
    setHasReachedLimit(false);
    router.push('/');
  }, [router]);

  const goToPaywall = useCallback((): void => {
    setHasReachedLimit(false);
    router.push('/settings/paywall');
  }, [router]);

  const askPermissions = useCallback(async (): Promise<void> => {
    if (activityState !== 'notStarted') {
      return;
    }

    const foregroundPermissions = await Location.requestForegroundPermissionsAsync();
    setHasPermission(foregroundPermissions.granted);
  }, [activityState]);

  const checkPermissionsAndBattery = useCallback(async (): Promise<void> => {
    if (!isFocused) {
      return;
    }

    await askPermissions();
    try {
      const batteryAvailable = await Battery.isAvailableAsync();
      if (!batteryAvailable) {
        return;
      }

      const isOptimizationEnabled = await Battery.isLowPowerModeEnabledAsync();
      setHasBatteryOptimization(isOptimizationEnabled);
    } catch {
      setHasBatteryOptimization(true);
    }
  }, [askPermissions, isFocused]);

  const checkCanRecord = useCallback(async (): Promise<boolean> => {
    if (isNumberActivitiesFetching || numberActivitiesData === undefined || subscriptionLoading) {
      return false;
    }

    if (numberActivitiesData < NUMBER_FREE_ACTIVITIES || currentSubscription?.isActive) {
      return true;
    }

    setHasReachedLimit(true);
    return false;
  }, [currentSubscription, isNumberActivitiesFetching, numberActivitiesData, subscriptionLoading]);

  const onAppStateChanged = useCallback(
    async (appState: AppStateStatus): Promise<void> => {
      if (appState !== 'active' || !isFocused || hasPermission) {
        return;
      }

      setErrorStarting(false);
      if (activityState !== 'notStarted') {
        return;
      }

      askPermissions();
    },
    [activityState, askPermissions, hasPermission, isFocused],
  );

  const onRecordScreenFocused = useCallback(async (): Promise<void> => {
    if (activityState !== 'notStarted' || isNumberActivitiesFetching) {
      return;
    }

    refetchNumberActivities();
  }, [activityState, isNumberActivitiesFetching, refetchNumberActivities]);

  const onStartActivity = async (): Promise<void> => {
    try {
      const isRecording = await activityTask.isRecording();
      if (isRecording) {
        await activityTask.stopRecording();
      }

      activityTask.reset();
      await activityTask.startRecording(activityType as ActivityType);
      setActivityState('recording');
    } catch {
      setErrorStarting(true);
    }
  };

  const onPauseActivity = async (): Promise<void> => {
    await activityTask.stopRecording();

    const hasRecorded = activityTask.locations.length > 0;
    setActivityState(hasRecorded ? 'paused' : 'notStarted');
  };

  const onResumeActivity = async (): Promise<void> => {
    await activityTask.resumeRecording(activityType as ActivityType);
    setActivityState('recording');
  };

  const onStopActivity = async (): Promise<void> => {
    await activityTask.stopRecording();

    const hasRecorded = activityTask.locations.length > 0;
    setActivityState(hasRecorded ? 'stopped' : 'notStarted');
    if (hasRecorded) {
      router.push({ pathname: `/activity/save`, params: { activityType } });
    }
  };

  useEffect(() => {
    const changeSubscription = AppState.addEventListener('change', onAppStateChanged);

    return () => {
      changeSubscription.remove();
    };
  }, [onAppStateChanged]);

  useEffect(() => {
    navigation.addListener('focus', onRecordScreenFocused);

    return () => {
      navigation.removeListener('focus', onRecordScreenFocused);
    };
  }, [navigation, onRecordScreenFocused]);

  useEffect(() => {
    if (isNumberActivitiesFetching) {
      return;
    }

    (async () => {
      if (!(await checkCanRecord())) {
        return;
      }

      await checkPermissionsAndBattery();
    })();
  }, [checkCanRecord, checkPermissionsAndBattery, isNumberActivitiesFetching]);

  useEffect(() => {
    if (isFetchingPreferences) {
      return;
    }

    setActivityType(preferencesData?.defaultActivityType || ActivityType.RUNNING);
  }, [isFetchingPreferences, preferencesData?.defaultActivityType]);

  return (
    <>
      <RecordUI
        activityType={activityType || ActivityType.RUNNING}
        activityState={activityState}
        hasPermission={hasPermission}
        errorStarting={errorStarting}
        hasBatteryOptimization={hasBatteryOptimization}
        distanceMeasurementSystem={preferencesData?.measurement || DistanceMeasurementSystem.METRIC}
        onChangeActivityType={setActivityType}
        onStartActivity={onStartActivity}
        onPauseActivity={onPauseActivity}
        onResumeActivity={onResumeActivity}
        onStopActivity={onStopActivity}
      />
      <ReachedLimitFreePlanModal
        visible={hasReachedLimit}
        goToPaywall={goToPaywall}
        close={goToHome}
      />
    </>
  );
};

export default RecordScreen;
