import React, { type FC, useMemo, useRef, useState } from 'react';

import { StatusBar } from 'expo-status-bar';

import type GorhomBottomSheet from '@gorhom/bottom-sheet';
import { Controller, useFormContext } from 'react-hook-form';

import { getCalories, getPaceInMinutesPerKilometers } from '@activity';
import { useTheme } from '@theme';

import useHealthInformation from '@api/healthInformation/useHealthInformation';

import SavingModal from '@components/common/SavingModal';
import ActivityDetails from '@components/common/activity/ActivityDetails';
import ActivityTypeBottomSheet from '@components/common/activity/ActivityTypeBottomSheet';

import { ActivityType } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import ActivityTask from '@tasks/ActivityTask';

import i18n from '@translations/i18n';

import DarkSnapshotMap from './DarkSnapshotMap';
import LightSnapshotMap from './LightSnapshotMap';

type FormData = {
  name: string;
  type: ActivityType;
};

type Props = {
  distanceMeasurementSystem: DistanceMeasurementSystem;
  uploading: boolean;
  hasError: boolean;
  onSubmit: (data: FormData) => void;
  onDiscard: () => void;
};

const SaveUI: FC<Props> = ({
  distanceMeasurementSystem,
  uploading,
  hasError,
  onSubmit,
  onDiscard,
}) => {
  const activityTypeBottomSheetRef = useRef<GorhomBottomSheet>(null);

  const [snapshotLightReady, setSnapshotLightReady] = useState(false);
  const [snapshotDarkReady, setSnapshotDarkReady] = useState(false);

  const { data: healthInformationData } = useHealthInformation();

  const { control, handleSubmit, watch } = useFormContext<FormData>();
  const activityType = watch('type');

  const theme = useTheme();

  const activityTask = ActivityTask.getInstance();

  const summary = useMemo(() => {
    const createdAt = new Date(activityTask.startTimestamp).toISOString();
    const duration = (activityTask.endTimestamp - activityTask.startTimestamp) / 1000;
    const pace = getPaceInMinutesPerKilometers(
      activityTask.distance,
      duration,
      DistanceMeasurementSystem.METRIC,
    );

    const activitySummary = {
      type: activityType,
      createdAt,
      distance: activityTask.distance,
      duration,
      pace,
    };
    if (!healthInformationData?.healthInformation) {
      return activitySummary;
    }

    const calories = getCalories(
      activityType,
      pace,
      duration,
      healthInformationData.healthInformation,
    );
    if (!calories) {
      return activitySummary;
    }

    return { ...activitySummary, calories };
  }, [
    activityTask.startTimestamp,
    activityTask.endTimestamp,
    activityTask.distance,
    activityType,
    healthInformationData?.healthInformation,
  ]);

  const onMapSnapshotLight = (snapshotUri: string): void => {
    activityTask.mapImageLight = snapshotUri;
    setSnapshotLightReady(snapshotUri.length > 0);
  };

  const onMapSnapshotDark = (snapshotUri: string): void => {
    activityTask.mapImageDark = snapshotUri;
    setSnapshotDarkReady(snapshotUri.length > 0);
  };

  return (
    <>
      <StatusBar translucent />
      <ActivityDetails
        summary={summary}
        mapSnapshot={theme.dark ? activityTask.mapImageDark : activityTask.mapImageLight}
        mapSnapshotFetching={
          (theme.dark && (!snapshotDarkReady || activityTask.mapImageDark.length === 0)) ||
          (!theme.dark && (!snapshotLightReady || activityTask.mapImageLight.length === 0))
        }
        mapSnapshotError={false}
        locations={activityTask.locations}
        locationsFetching={false}
        locationsError={false}
        distanceMeasurementSystem={distanceMeasurementSystem}
        form={{ control, onSubmit, handleSubmit }}
        inputsDisabled={!uploading}
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
      />
      <SavingModal
        title={i18n.t('saveActivity.saving')}
        errorMessage={i18n.t('saveActivity.errors.failureMessage')}
        saving={uploading}
        hasError={hasError}
        retryLabel={i18n.t('saveActivity.errors.retry')}
        onRetry={handleSubmit(onSubmit)}
        discardLabel={i18n.t('saveActivity.errors.cancel')}
        onDiscard={onDiscard}
      />
      {!snapshotLightReady && (
        <LightSnapshotMap
          locations={activityTask.locations}
          onMapSnapshot={onMapSnapshotLight}
          hideIndicator
        />
      )}
      {snapshotLightReady && !snapshotDarkReady && (
        <DarkSnapshotMap
          locations={activityTask.locations}
          onMapSnapshot={onMapSnapshotDark}
          hideIndicator
        />
      )}
    </>
  );
};

export default SaveUI;
