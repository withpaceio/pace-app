import type { FC } from 'react';

import styled from 'styled-components/native';

import ActivitySummaryTileUI from '@components/common/activity/summaryTile/ActivitySummaryTileUI';

import type { Activity } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

const Wrapper = styled.Pressable<{ isOpen: boolean }>`
  width: 100%;
  align-self: center;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding}px;

  background-color: ${({ theme }) => theme.colors.componentBackground};
  padding: 5px;
  border-radius: 4px;

  border-width: 1px;

  transition: border-color 0.25s ease;

  border-color: ${({ isOpen, theme }) =>
    isOpen ? theme.colors.purple : theme.colors.componentBackground};
`;

type Props = {
  activity: Activity;
  isFirst: boolean;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  isOpen?: boolean;
  onPress?: () => void;
};

const ActivityTile: FC<Props> = ({ activity, distanceMeasurementSystem, isOpen, onPress }) => (
  <Wrapper isOpen={Boolean(isOpen)} onPress={onPress}>
    <ActivitySummaryTileUI
      activity={activity}
      distanceMeasurementSystem={distanceMeasurementSystem}
      hasError={false}
    />
  </Wrapper>
);

export default ActivityTile;
