import React, { type FC, useCallback, useState } from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import useActivity from '@api/activity/useActivity';
import useDeleteActivity from '@api/activity/useDeleteActivity';
import usePreferences from '@api/preferences/usePreferences';

import ActivityDetailsUI from '@components/activityDetails/ActivityDetailsUI';
import ConfirmDeleteActivityModal from '@components/activityDetails/ConfirmDeleteActivityModal';

import { DistanceMeasurementSystem } from '@models/UnitSystem';

const ActivityDetailsScreen: FC = () => {
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

  const router = useRouter();
  const { id: activityId } = useLocalSearchParams<{ id?: string }>();
  const { data: activity } = useActivity(activityId);
  const { data: preferencesData } = usePreferences();

  const {
    mutate: deleteActivity,
    reset: resetDeleteActivityMutation,
    isError,
  } = useDeleteActivity();

  const onDeleteActivity = useCallback((): void => {
    if (typeof activityId === 'undefined') {
      return;
    }

    resetDeleteActivityMutation();
    setIsConfirmDeleteModalOpen(false);
    deleteActivity({ activityId });

    router.back();
  }, [activityId, deleteActivity, resetDeleteActivityMutation, router]);

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
