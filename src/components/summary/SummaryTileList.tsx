import React, { type FC, useCallback, useRef } from 'react';
import { FlatList, type ListRenderItem, type ViewToken, useWindowDimensions } from 'react-native';

import type { Activity } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import SummaryTile from './SummaryTile';

const viewabilityConfig = {
  minimumViewTime: 50,
  itemVisiblePercentThreshold: 60,
  waitForInteraction: false,
};

type Props = {
  today: Date;
  timePeriods: { start: Date; end: Date }[];
  activities: Activity[] | null;
  period: 'week' | 'month';
  distanceMeasurementSystem: DistanceMeasurementSystem;
  onSelectedActivities: (activityIds: string[]) => void;
  onVisibleTimePeriodChanged: (start: Date, end: Date) => void;
};

const SummaryTileList: FC<Props> = ({
  today,
  timePeriods,
  activities,
  period,
  distanceMeasurementSystem,
  onSelectedActivities,
  onVisibleTimePeriodChanged,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  const keyExtractor = useCallback(
    (item: { start: Date; end: Date }) => item.start.toISOString(),
    [],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<{ start: Date; end: Date }> | null | undefined, index: number) => ({
      length: windowWidth,
      offset: windowWidth * index,
      index,
    }),
    [windowWidth],
  );

  const renderItem: ListRenderItem<{ start: Date; end: Date }> = useCallback(
    ({ item }) => (
      <SummaryTile
        key={item.start.toISOString()}
        today={today}
        startDate={item.start}
        endDate={item.end}
        activities={activities}
        period={period}
        distanceMeasurementSystem={distanceMeasurementSystem}
        onSelectActivities={onSelectedActivities}
      />
    ),
    [today, activities, period, distanceMeasurementSystem, onSelectedActivities],
  );

  const onViewableItemsChanged = useRef(
    ({ changed }: { viewableItems: ViewToken[]; changed: ViewToken[] }): void => {
      const [viewableItem] = changed;
      if (!viewableItem || !viewableItem.isViewable) {
        return;
      }

      const {
        item: { start, end },
      } = viewableItem;
      onVisibleTimePeriodChanged(start, end);
    },
  ).current;

  return (
    <FlatList
      data={timePeriods}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      initialNumToRender={1}
      maxToRenderPerBatch={1}
      updateCellsBatchingPeriod={50}
      windowSize={3}
      showsHorizontalScrollIndicator={false}
      removeClippedSubviews
      horizontal
      pagingEnabled
      inverted
    />
  );
};

export default SummaryTileList;
