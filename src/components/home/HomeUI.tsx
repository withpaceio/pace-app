import React, { type FC, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';

import type { InfiniteData } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '@auth';
import { useTheme } from '@theme';

import { ErrorView } from '@components/common';

import type { Activity } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';
import i18n from '@translations/i18n';

import ActivityTile from './ActivityTile';
import Loading from './Loading';
import NoActivities from './NoActivities';

type Props = {
  data: InfiniteData<{ activities: Activity[]; nextCursor: string | undefined }> | undefined;
  isLoading: boolean;
  initialLoading: boolean;
  hasError: boolean;
  refreshing: boolean;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  onEndReached: () => void;
  onRefresh: () => void;
};

const HomeUI: FC<Props> = ({
  data,
  isLoading,
  initialLoading,
  hasError,
  refreshing,
  distanceMeasurementSystem,
  onEndReached,
  onRefresh,
}) => {
  const {
    state: { username },
  } = useAuth();

  const theme = useTheme();

  const sortedActivities = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.pages.flatMap(({ activities }) => activities).filter((activity) => !!activity);
  }, [data]);

  const renderItem: ListRenderItem<Activity> = useCallback(
    ({ index, item }) => (
      <ActivityTile
        activity={item}
        isFirst={index === 0}
        distanceMeasurementSystem={distanceMeasurementSystem}
      />
    ),
    [distanceMeasurementSystem],
  );

  const keyExtractor = (activity: Activity): string => activity.createdAt;

  if (!data && hasError) {
    return <ErrorView message={i18n.t('home.errors.activitiesLoading')} />;
  }

  return (
    <>
      <StatusBar translucent />
      <FlatList
        data={sortedActivities}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={() => <NoActivities username={username} isLoading={isLoading} />}
        ListFooterComponent={() => (
          <Loading isLoading={isLoading} initialLoading={initialLoading} />
        )}
        onEndReachedThreshold={0.3}
        onEndReached={onEndReached}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.purple]}
            tintColor={theme.colors.purple}
            progressBackgroundColor={theme.colors.componentBackground}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </>
  );
};

export default HomeUI;
