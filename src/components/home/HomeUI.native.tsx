import React, { type FC, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { useAuth } from '@auth';
import { useTheme } from '@theme';

import type { Activity } from '@models/Activity';

import ActivityTile from './ActivityTile';
import Loading from './Loading';
import NoActivities from './NoActivities';
import type { Props } from './types';

const HomeUI: FC<Props> = ({
  data,
  isLoading,
  initialLoading,
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
