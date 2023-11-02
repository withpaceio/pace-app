import React, { type FC, useRef } from 'react';

import type GorhomBottomSheet from '@gorhom/bottom-sheet';
import { Controller, useFormContext } from 'react-hook-form';

import { useTheme } from '@theme';

import useActivityLocations from '@api/activity/useActivityLocations';
import useActivityMapSnapshot from '@api/activity/useActivityMapSnapshot';

import ActivityDetails from '@components/common/activity/ActivityDetails';
import ActivityTypeBottomSheet from '@components/common/activity/ActivityTypeBottomSheet';

import { type Activity, type ActivitySummary, ActivityType } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

type FormData = {
  name: string;
  type: ActivityType;
};

type Props = {
  activity: Activity | undefined;
  onSubmit: (data: FormData) => void;
};

const EditActivityUI: FC<Props> = ({ activity, onSubmit }) => {
  const activityTypeBottomSheetRef = useRef<GorhomBottomSheet>(null);

  const { control, handleSubmit, watch } = useFormContext<FormData>();
  const activityType = watch('type');

  const theme = useTheme();

  const {
    data: activityLocationsData,
    isLoading: isActivityLocationsLoading,
    isError: isActivityLocationsError,
  } = useActivityLocations({
    activityId: activity?.id,
    activityEncryptionKey: activity?.encryptionKey,
  });

  const {
    data: mapSnapshotData,
    isLoading: isMapSnapshotLoading,
    isError: isMapSnapshotError,
  } = useActivityMapSnapshot({
    activityId: activity?.id,
    activityEncryptionKey: activity?.encryptionKey,
    mapSnapshotTheme: theme.dark ? 'dark' : 'light',
  });

  if (!activity) {
    return null;
  }

  return (
    <>
      <ActivityDetails
        summary={{
          ...(activity.summary as ActivitySummary),
          type: activityType || (activity.summary as ActivitySummary).type,
        }}
        mapSnapshot={mapSnapshotData?.mapSnapshot}
        mapSnapshotFetching={isMapSnapshotLoading}
        mapSnapshotError={isMapSnapshotError}
        locations={activityLocationsData?.locations}
        locationsFetching={isActivityLocationsLoading}
        locationsError={isActivityLocationsError}
        distanceMeasurementSystem={DistanceMeasurementSystem.METRIC}
        form={{ control, handleSubmit, onSubmit }}
        onEditActivityType={() => {
          activityTypeBottomSheetRef.current?.expand();
        }}
      />
      <Controller
        control={control}
        render={({ field: { onChange } }) => (
          <ActivityTypeBottomSheet
            ref={activityTypeBottomSheetRef}
            onChangeActivityType={(type) => {
              onChange(type);
              activityTypeBottomSheetRef.current?.close();
            }}
          />
        )}
        name="type"
        rules={{ required: true }}
        defaultValue={(activity?.summary as ActivitySummary).type || ActivityType.RUNNING}
      />
    </>
  );
};

export default EditActivityUI;
