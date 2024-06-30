import { type FC, useCallback, useMemo, useState } from 'react';
import { ListRenderItem, RefreshControl, View } from 'react-native';

import styled from 'styled-components/native';

import { useAuth } from '@auth';
import { useTheme } from '@theme';

import ActivityDetailsUI from '@components/activityDetails/ActivityDetailsUI';
import { Text } from '@components/ui';

import type { Activity } from '@models/Activity';

import ActivityTile from './ActivityTile';
import Loading from './Loading';
import NoActivities from './NoActivities';
import type { Props } from './types';

const Wrapper = styled.View`
  flex: 1;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  overflow-y: scroll;
`;

const StyledFlatList = styled.FlatList`
  flex: 1;
  width: 100%;
  height: 100%;
  border-right-width: 0.5px;
  border-color: ${({ theme }) => theme.colors.separatorColor};
`;

const ActivityDetailsWrapper = styled.View`
  width: 60%;
  height: calc(100% - 50px);
  margin-top: 50px;

  overflow: scroll;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HomeUI: FC<Props> = ({
  data,
  isLoading,
  initialLoading,
  refreshing,
  distanceMeasurementSystem,
  onEndReached,
  onRefresh,
}) => {
  const [openedActivity, setOpenedActivity] = useState<Activity>();

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
        isOpen={openedActivity?.id === item.id}
        onPress={() => {
          setOpenedActivity(item);
        }}
      />
    ),
    [distanceMeasurementSystem, openedActivity?.id],
  );

  const keyExtractor = (activity: Activity): string => activity.createdAt;

  return (
    <Wrapper>
      {/* @ts-ignore */}
      <StyledFlatList
        contentContainerStyle={{
          paddingLeft: theme.sizes.outerPadding,
          paddingRight: theme.sizes.outerPadding,
          paddingTop: 70,
        }}
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
      <ActivityDetailsWrapper>
        {openedActivity ? (
          <ActivityDetailsUI
            activity={openedActivity}
            distanceMeasurementSystem={distanceMeasurementSystem}
            onDeleteActivity={console.log}
          />
        ) : (
          <View>
            <Text>select an activity</Text>
          </View>
        )}
      </ActivityDetailsWrapper>
    </Wrapper>
  );
};

export default HomeUI;
