import React, { type FC, useMemo, useRef } from 'react';
import { Animated, useWindowDimensions } from 'react-native';

import { useTheme } from '@theme';

import StaticMapImage from '@components/common/StaticMapImage';

import type { ActivityLocation } from '@models/Activity';

import ActivityHeader, { Props as ActivityHeaderProps } from './ActivityHeader';
import BackButton from './BackButton';
import ActivityChartsProvider from './charts/ActivityChartsProvider';

type Props = Omit<ActivityHeaderProps, 'imageHeight' | 'top' | 'isLoading'> & {
  mapSnapshot: string | undefined;
  mapSnapshotFetching: boolean;
  mapSnapshotError: boolean;
  locations: ActivityLocation[] | undefined;
  locationsFetching: boolean;
  locationsError: boolean;
  onPressMap?: () => void;
  onGoBack?: () => void;
};

const ActivityDetails: FC<Props> = ({
  summary,
  mapSnapshot,
  mapSnapshotFetching,
  mapSnapshotError,
  locations,
  locationsFetching,
  locationsError,
  distanceMeasurementSystem,
  inputsDisabled,
  form,
  onEdit,
  onEditActivityType,
  onPressMap,
  onGoBack,
}) => {
  const yScroll = useRef(new Animated.Value(0)).current;

  const theme = useTheme();

  const { width: windowWidth } = useWindowDimensions();
  const imageHeight = useMemo(
    () =>
      windowWidth *
      (theme.sizes.activityMapSnapshot.height / theme.sizes.activityMapSnapshot.width),
    [windowWidth, theme],
  );

  return (
    <>
      <Animated.ScrollView
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: yScroll } },
            },
          ],
          { useNativeDriver: true },
        )}>
        <StaticMapImage
          imageUri={mapSnapshot}
          fetching={mapSnapshotFetching}
          error={mapSnapshotError}
          width={windowWidth}
          top={yScroll}
          height={imageHeight}
          onPress={onPressMap}
        />
        <ActivityHeader
          summary={summary}
          locations={locations}
          distanceMeasurementSystem={distanceMeasurementSystem}
          isLoading={mapSnapshotFetching || locationsFetching}
          inputsDisabled={inputsDisabled}
          top={!form ? yScroll : undefined}
          imageHeight={imageHeight}
          onEdit={onEdit}
          onEditActivityType={onEditActivityType}
          form={form}
        />
        {summary && !form && (
          <ActivityChartsProvider
            summary={summary}
            locations={locations}
            locationsFetching={locationsFetching}
            locationsError={locationsError}
            distanceMeasurementSystem={distanceMeasurementSystem}
          />
        )}
      </Animated.ScrollView>
      {!form && onGoBack && (
        <BackButton imageHeight={imageHeight} yScroll={yScroll} onPress={onGoBack} />
      )}
    </>
  );
};

export default ActivityDetails;
