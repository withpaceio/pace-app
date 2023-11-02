import React, { type FC } from 'react';

import styled from 'styled-components/native';

import { ActivityType } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import ActionsWrapper from './ActionsWrapper';
import ActivityStatistics from './ActivityStatistics';
import ActivityTypeIndicator from './ActivityTypeIndicator';
import GoButton from './GoButton';
import StopButton from './StopButton';

const ButtonsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  width: 100%;
`;

type Props = {
  activityType: ActivityType;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  onStartActivity: () => void;
  onOpenActivityTypeSheet: () => void;
};

const ActivityActions: FC<Props> = ({
  activityType,
  distanceMeasurementSystem,
  onStartActivity,
  onOpenActivityTypeSheet,
}) => (
  <ActionsWrapper>
    <ActivityStatistics
      activityType={activityType}
      durationInSeconds={0}
      distanceMeasurementSystem={distanceMeasurementSystem}
    />
    <ButtonsWrapper>
      <ActivityTypeIndicator
        activityType={activityType}
        onOpenActivityTypeSheet={onOpenActivityTypeSheet}
      />
      <GoButton onPress={onStartActivity} />
      <StopButton disabled />
    </ButtonsWrapper>
  </ActionsWrapper>
);

export default ActivityActions;
