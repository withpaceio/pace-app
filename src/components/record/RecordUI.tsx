import React, { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import type GorohmBottomSheet from '@gorhom/bottom-sheet';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useNavigation } from '@react-navigation/native';
import type { LocationObject } from 'expo-location';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import ActivityTypeBottomSheet from '@components/common/activity/ActivityTypeBottomSheet';

import { type ActivityTaskState, ActivityType } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';
import Screens from '@navigation/screens';
import type { RecordScreenProps } from '@navigation/types';
import ActivityTask, { ActivityListener } from '@tasks/ActivityTask';

import ActivityRunning from './ActivityRunning';
import ActivityStart from './ActivityStart';
import AskPermissions from './AskPermissions';
import BackButton from './BackButton';
import BatteryModeWarningModal from './BatteryModeWarningModal';
import PermissionsLoading from './PermissionsLoading';
import RecenterMapButton from './RecenterMapButton';
import { MAPTILER_URL_DARK, MAPTILER_URL_LIGHT } from '../../consts';

const Wrapper = styled.View`
  flex: 1;

  display: flex;
  flex-direction: column;
`;

const StyledMapView = styled(MapLibreGL.MapView)`
  flex: 1;

  width: 100%;
`;

type Props = {
  activityType: ActivityType;
  hasPermission: boolean | null;
  errorStarting: boolean;
  hasBatteryOptimization: boolean;
  activityState: ActivityTaskState;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  onChangeActivityType: (activityType: ActivityType) => void;
  onStartActivity: () => Promise<void>;
  onPauseActivity: () => Promise<void>;
  onResumeActivity: () => Promise<void>;
  onStopActivity: () => Promise<void>;
};

const RecordUI: FC<Props> = ({
  activityType,
  hasPermission,
  errorStarting,
  hasBatteryOptimization,
  activityState,
  distanceMeasurementSystem,
  onChangeActivityType,
  onStartActivity,
  onPauseActivity,
  onResumeActivity,
  onStopActivity,
}) => {
  const activityTypeBottomSheetRef = useRef<GorohmBottomSheet>(null);

  const [batteryOptimizationModalOpen, setBatteryOptimizationModalOpen] =
    useState(hasBatteryOptimization);
  const [mapReady, setMapReady] = useState(Platform.OS === 'ios');
  const [coordinates, setCoordinates] = useState<number[][]>([]);
  const [followUserLocation, setFollowUserLocation] = useState(true);
  const [userFollowMode, setUserFollowMode] = useState<MapLibreGL.UserTrackingModes | null>(
    MapLibreGL.UserTrackingModes.FollowWithCourse,
  );

  const navigation = useNavigation<RecordScreenProps['navigation']>();
  const theme = useTheme();

  const onRecenterMap = useCallback((): void => {
    setFollowUserLocation(true);
    setUserFollowMode(MapLibreGL.UserTrackingModes.FollowWithCourse);
  }, []);

  const onMapFullyRendered = useCallback((): void => {
    setMapReady(true);
    onRecenterMap();
  }, [onRecenterMap]);

  const onUserTrackingModeChange: MapLibreGL.Camera['props']['onUserTrackingModeChange'] = (
    event,
  ): void => {
    // Types are wrong in the MapLibre package
    // @ts-expect-error
    setUserFollowMode(event.nativeEvent.payload.followUserMode);
    setFollowUserLocation(event.nativeEvent.payload.followUserLocation);
  };

  const onNewLocations: ActivityListener = useCallback((locations: LocationObject[]): void => {
    const newCoordinates = locations.map(({ coords: { latitude, longitude } }) => [
      longitude,
      latitude,
    ]);
    setCoordinates((prevCoordinates) => prevCoordinates.concat(newCoordinates));
  }, []);

  const startActivity = useCallback((): void => {
    setCoordinates([]);
    ActivityTask.getInstance().addListener(onNewLocations);
    onStartActivity();
  }, [onNewLocations, onStartActivity]);

  const stopActivity = useCallback((): void => {
    ActivityTask.getInstance().removeListener(onNewLocations);
    onStopActivity();
  }, [onNewLocations, onStopActivity]);

  useEffect(() => {
    ActivityTask.getInstance().addListener(onNewLocations);

    return () => {
      ActivityTask.getInstance().removeListener(onNewLocations);
    };
  }, [onNewLocations]);

  useEffect(() => {
    if (activityState !== 'notStarted') {
      return;
    }

    setBatteryOptimizationModalOpen(hasBatteryOptimization);
  }, [activityState, hasBatteryOptimization]);

  if (hasPermission === null) {
    return (
      <Wrapper>
        <PermissionsLoading />
      </Wrapper>
    );
  }

  if (hasPermission === false || errorStarting) {
    return (
      <Wrapper>
        <AskPermissions />
      </Wrapper>
    );
  }

  return (
    <>
      <Wrapper>
        <StyledMapView
          styleURL={theme.dark ? MAPTILER_URL_DARK : MAPTILER_URL_LIGHT}
          logoEnabled={false}
          attributionEnabled
          attributionPosition={{ bottom: 8, right: 8 }}
          onDidFinishRenderingMapFully={onMapFullyRendered}>
          {mapReady && <MapLibreGL.UserLocation showsUserHeadingIndicator />}
          <MapLibreGL.Camera
            followUserMode={userFollowMode ?? undefined}
            zoomLevel={18}
            followZoomLevel={18}
            followUserLocation={followUserLocation}
            onUserTrackingModeChange={onUserTrackingModeChange}
            animationDuration={0}
          />
          {coordinates.length > 1 && (
            <>
              <MapLibreGL.ShapeSource
                id="activityCoordinates"
                shape={{
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      properties: {},
                      geometry: { type: 'LineString', coordinates },
                    },
                  ],
                }}>
                <MapLibreGL.LineLayer
                  id="locations"
                  style={{ lineColor: theme.colors.purple, lineWidth: 5 }}
                />
              </MapLibreGL.ShapeSource>
            </>
          )}
        </StyledMapView>
        <RecenterMapButton onPress={onRecenterMap} />
        <BackButton onPress={() => navigation.navigate(Screens.HOME)} />
        {activityState === 'notStarted' && (
          <ActivityStart
            activityType={activityType}
            distanceMeasurementSystem={distanceMeasurementSystem}
            onStartActivity={startActivity}
            onOpenActivityTypeSheet={() => {
              activityTypeBottomSheetRef.current?.expand();
            }}
          />
        )}
        {(activityState === 'recording' || activityState === 'paused') && (
          <ActivityRunning
            activityType={activityType}
            activityState={activityState}
            distanceMeasurementSystem={distanceMeasurementSystem}
            onPauseActivity={onPauseActivity}
            onResumeActivity={onResumeActivity}
            onStopActivity={stopActivity}
          />
        )}
      </Wrapper>
      <ActivityTypeBottomSheet
        ref={activityTypeBottomSheetRef}
        onChangeActivityType={(type) => {
          onChangeActivityType(type);
          activityTypeBottomSheetRef.current?.close();
        }}
      />
      <BatteryModeWarningModal
        isOpen={batteryOptimizationModalOpen}
        onClose={() => setBatteryOptimizationModalOpen(false)}
      />
    </>
  );
};

export default RecordUI;
