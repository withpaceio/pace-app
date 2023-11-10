import React, { type FC, useCallback } from 'react';
import { Pressable, useWindowDimensions } from 'react-native';

import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

import ActivitySummaryTileUI from '@components/common/activity/summaryTile/ActivitySummaryTileUI';

import type { Activity } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import ActivityMap from './ActivityMap';

const Wrapper = styled.View<{ windowWidth: number; isFirst: boolean }>`
  width: ${({ theme, windowWidth }) => windowWidth - 2 * theme.sizes.outerPadding}px;
  max-width: ${({ theme }) => theme.sizes.activityMapSnapshot.width}px;
  align-self: center;

  margin-top: ${({ isFirst, theme }) => (isFirst ? theme.sizes.outerPadding : 0)}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;

  background-color: ${({ theme }) => theme.colors.componentBackground};

  shadow-color: ${({ theme }) => theme.colors.black};
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  shadow-offset: 0px 5px;
  elevation: 4;

  border-radius: 8px;
`;

type Props = {
  activity: Activity;
  isFirst: boolean;
  distanceMeasurementSystem: DistanceMeasurementSystem;
};

const ActivityTile: FC<Props> = ({ activity, isFirst, distanceMeasurementSystem }) => {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const goToActivityDetails = useCallback((): void => {
    router.push(`/activity/${activity.id}`);
  }, [activity.id]);

  return (
    <Pressable onPress={goToActivityDetails}>
      <Wrapper windowWidth={width} isFirst={isFirst}>
        <ActivityMap activity={activity} />
        <ActivitySummaryTileUI
          activity={activity}
          distanceMeasurementSystem={distanceMeasurementSystem}
          hasError={false}
        />
      </Wrapper>
    </Pressable>
  );
};

export default ActivityTile;
