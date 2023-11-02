import React, { type FC, useCallback, useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';

import styled from 'styled-components/native';

import { type ActivityTaskState, ActivityType } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';
import ActivityTask from '@tasks/ActivityTask';

import ActionsWrapper from './ActionsWrapper';
import ActivityStatistics from './ActivityStatistics';
import ActivityTypeIndicator from './ActivityTypeIndicator';
import GoButton from './GoButton';
import PauseButton from './PauseButton';
import StopButton from './StopButton';

const STOP_WATCH_REFRESH_INTERVAL_MS = 1000;

const ButtonsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  width: 100%;
`;

type Props = {
  activityType: ActivityType;
  activityState: ActivityTaskState;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  onPauseActivity: () => void;
  onResumeActivity: () => void;
  onStopActivity: () => void;
};

const ActivityRunning: FC<Props> = ({
  activityType,
  activityState,
  distanceMeasurementSystem,
  onPauseActivity,
  onResumeActivity,
  onStopActivity,
}) => {
  const activityTask = ActivityTask.getInstance();

  const [seconds, setSeconds] = useState(0);

  const updateStopWatch = useCallback((): void => {
    setSeconds((prevSeconds) => prevSeconds + 1);
  }, []);

  const startStopWatch = useCallback((): void => {
    // @ts-expect-error
    activityTask.stopWatchId = setInterval(() => {
      updateStopWatch();
    }, STOP_WATCH_REFRESH_INTERVAL_MS);
  }, [activityTask, updateStopWatch]);

  const stopStopWatch = useCallback((): void => {
    if (activityTask.stopWatchId !== null) {
      clearInterval(activityTask.stopWatchId);
    }

    activityTask.stopWatchId = null;
  }, [activityTask]);

  const onFocus = useCallback((): void => {
    if (activityTask.stopWatchId !== null) {
      return;
    }

    setSeconds(Math.trunc((activityTask.endTimestamp - activityTask.startTimestamp) / 1000));
    startStopWatch();
  }, [
    activityTask.endTimestamp,
    activityTask.startTimestamp,
    activityTask.stopWatchId,
    startStopWatch,
  ]);

  const onBlur = useCallback((): void => {
    stopStopWatch();
  }, [stopStopWatch]);

  const onPausePressed = useCallback((): void => {
    stopStopWatch();
    onPauseActivity();
  }, [onPauseActivity, stopStopWatch]);

  const onResumePressed = useCallback((): void => {
    startStopWatch();
    onResumeActivity();
  }, [onResumeActivity, startStopWatch]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      return;
    }

    const focusSubscription = AppState.addEventListener('focus', onFocus);
    const blurSubscription = AppState.addEventListener('blur', onBlur);

    return () => {
      focusSubscription.remove();
      blurSubscription.remove();
    };
  }, [onFocus, onBlur]);

  useEffect(() => {
    startStopWatch();

    return () => {
      stopStopWatch();
    };
  }, [startStopWatch, stopStopWatch]);

  return (
    <ActionsWrapper>
      <ActivityStatistics
        activityType={activityType}
        durationInSeconds={seconds}
        distanceMeasurementSystem={distanceMeasurementSystem}
      />
      <ButtonsWrapper>
        <ActivityTypeIndicator activityType={activityType} disabled />
        {activityState === 'recording' && <PauseButton onPress={onPausePressed} />}
        {activityState === 'paused' && <GoButton onPress={onResumePressed} />}
        <StopButton onPress={onStopActivity} />
      </ButtonsWrapper>
    </ActionsWrapper>
  );
};

export default ActivityRunning;
