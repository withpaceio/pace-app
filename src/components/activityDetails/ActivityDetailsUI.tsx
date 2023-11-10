import React, { type FC, useCallback, useRef } from 'react';

import type GorohmBottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import useActivityLocations from '@api/activity/useActivityLocations';
import useActivityMapSnapshot from '@api/activity/useActivityMapSnapshot';

import ActivityDetails from '@components/common/activity/ActivityDetails';
import { ActivityIndicator, Text } from '@components/ui';

import type { Activity, ActivitySummary } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';
import i18n from '@translations/i18n';

import EditActivityBottomSheet from './EditActivityBottomSheet';

const Wrapper = styled.ScrollView`
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoadingActivityText = styled(Text)`
  font-size: 16px;
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
`;

type Props = {
  activity: Activity | undefined;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  onDeleteActivity: () => void;
};

const ActivityDetailsUI: FC<Props> = ({
  activity,
  distanceMeasurementSystem,
  onDeleteActivity,
}) => {
  const editActivityBottomSheetRef = useRef<GorohmBottomSheet>(null);

  const router = useRouter();
  const theme = useTheme();

  const {
    data: mapSnapshotData,
    isLoading: isMapSnapshotLoading,
    isError: isMapSnapshotError,
  } = useActivityMapSnapshot({
    activityId: activity?.id,
    activityEncryptionKey: activity?.encryptionKey,
    mapSnapshotTheme: theme.dark ? 'dark' : 'light',
  });

  const {
    data: activityLocationsData,
    isLoading: isActivityLocationsLoading,
    isError: isActivityLocationsError,
  } = useActivityLocations({
    activityId: activity?.id,
    activityEncryptionKey: activity?.encryptionKey,
  });

  const goToZoomableMap = useCallback((): void => {
    if (!activity) {
      return;
    }

    router.push(`/activity/${activity.id}/map`);
  }, [activity, router]);

  const goToEditActivity = useCallback((): void => {
    editActivityBottomSheetRef.current?.close();

    if (!activity) {
      return;
    }

    router.push(`/activity/${activity.id}/edit`);
  }, [activity, router]);

  const deleteActivity = useCallback((): void => {
    editActivityBottomSheetRef.current?.close();

    if (!activity) {
      return;
    }

    onDeleteActivity();
  }, [activity, onDeleteActivity]);

  const goBack = useCallback((): void => {
    router.back();
  }, [router]);

  if (!activity) {
    return (
      <>
        <Wrapper
          contentContainerStyle={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 100,
          }}>
          <ActivityIndicator size="large" />
          <LoadingActivityText>{i18n.t('activityDetails.activityLoading')}</LoadingActivityText>
        </Wrapper>
      </>
    );
  }

  return (
    <>
      <ActivityDetails
        summary={activity?.summary as ActivitySummary | null}
        mapSnapshot={mapSnapshotData?.mapSnapshot}
        mapSnapshotFetching={isMapSnapshotLoading}
        mapSnapshotError={isMapSnapshotError}
        locations={activityLocationsData?.locations}
        locationsFetching={isActivityLocationsLoading}
        locationsError={isActivityLocationsError}
        distanceMeasurementSystem={distanceMeasurementSystem}
        onEdit={() => {
          editActivityBottomSheetRef.current?.expand();
        }}
        onPressMap={goToZoomableMap}
        onGoBack={goBack}
      />
      <EditActivityBottomSheet
        ref={editActivityBottomSheetRef}
        onEditActivity={goToEditActivity}
        onDeleteActivity={deleteActivity}
      />
    </>
  );
};

export default ActivityDetailsUI;
