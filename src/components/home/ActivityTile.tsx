import type { FC } from 'react';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import ActivitySummaryTileUI from '@components/common/activity/summaryTile/ActivitySummaryTileUI';

import type { Activity } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

const Wrapper = styled.Pressable<{ isOpen: boolean }>`
  width: 100%;
  align-self: center;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding}px;
  background-color: ${({ isOpen, theme }) =>
    isOpen ? theme.colors.componentBackground : 'transparent'};

  padding: 5px;
  margin-bottom: 5px;

  border-radius: 5px;

  transition: background-color 0.25s ease;
`;

type Props = {
  activity: Activity;
  isFirst: boolean;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  isOpen?: boolean;
  onPress?: () => void;
};

const ActivityTile: FC<Props> = ({ activity, distanceMeasurementSystem, isOpen, onPress }) => {
  const theme = useTheme();

  return (
    <Wrapper
      isOpen={Boolean(isOpen)}
      onPress={onPress}
      // @ts-expect-error
      style={({ hovered }) =>
        hovered ? { backgroundColor: theme.colors.componentBackground } : {}
      }>
      <ActivitySummaryTileUI
        activity={activity}
        distanceMeasurementSystem={distanceMeasurementSystem}
        hasError={false}
      />
    </Wrapper>
  );
};

export default ActivityTile;
