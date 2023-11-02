import React, { type FC, useCallback, useState } from 'react';

import { CommonActions, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import useActivity from '@api/activity/useActivity';
import useDeleteActivity from '@api/activity/useDeleteActivity';
import usePreferences from '@api/preferences/usePreferences';

import ActivityDetailsUI from '@components/activityDetails/ActivityDetailsUI';
import ConfirmDeleteActivityModal from '@components/activityDetails/ConfirmDeleteActivityModal';

import { DistanceMeasurementSystem } from '@models/UnitSystem';
import Screens from '@navigation/screens';
import type { ActivityDetailsScreenProps } from '@navigation/types';

const ActivityDetailsScreen: FC<ActivityDetailsScreenProps> = ({ navigation }) => {
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

  const route = useRoute();
  // @ts-ignore
  const activityId = route?.params?.activityId;

  const { data: activity } = useActivity(activityId);
  const { data: preferencesData } = usePreferences();

  const {
    mutate: deleteActivity,
    reset: resetDeleteActivityMutation,
    isPending,
    isError,
  } = useDeleteActivity();

  const onDeleteActivity = useCallback((): void => {
    resetDeleteActivityMutation();

    deleteActivity({ activityId });

    setIsConfirmDeleteModalOpen(false);
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: Screens.HOME_NAVIGATOR }] }),
    );
  }, [activityId, deleteActivity, navigation, resetDeleteActivityMutation]);

  return (
    <>
      <StatusBar translucent />
      <ActivityDetailsUI
        activity={activity}
        distanceMeasurementSystem={preferencesData?.measurement || DistanceMeasurementSystem.METRIC}
        onDeleteActivity={() => {
          setIsConfirmDeleteModalOpen(true);
        }}
      />
      <ConfirmDeleteActivityModal
        isOpen={isConfirmDeleteModalOpen}
        isDeleting={isPending}
        isError={isError}
        onDelete={onDeleteActivity}
        onClose={() => {
          setIsConfirmDeleteModalOpen(false);
        }}
      />
    </>
  );
};

export default ActivityDetailsScreen;
