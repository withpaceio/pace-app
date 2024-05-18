import React, { type FC, useMemo } from 'react';

import styled from 'styled-components/native';

import {
  formatDistance,
  formatPace,
  formatSpeed,
  formatStopwatchDuration,
  getPaceInMinutesPerKilometers,
  getSpeedInKilometersPerHour,
} from '@activity';

import { Text } from '@components/ui';

import { ActivityType } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import ActivityTask from '@tasks/ActivityTask';

import i18n from '@translations/i18n';

const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  padding: ${({ theme }) => theme.sizes.innerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;

  border-radius: 10px;

  background-color: ${({ theme }) => theme.colors.componentBackground};
`;

const StopWatchText = styled(Text)`
  font-size: 40px;
  font-weight: bold;

  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const StatisticsWrapper = styled.View`
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const StatisticWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StatTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.secondary};
`;

const StatValue = styled(Text)`
  font-size: 24px;
  font-weight: bold;
`;

type Props = {
  activityType: ActivityType;
  durationInSeconds: number;
  distanceMeasurementSystem: DistanceMeasurementSystem;
};

const ActivityStatistics: FC<Props> = ({
  durationInSeconds,
  activityType,
  distanceMeasurementSystem,
}) => {
  const activityTask = ActivityTask.getInstance();

  const formattedDuration = useMemo(
    () => formatStopwatchDuration(durationInSeconds),
    [durationInSeconds],
  );

  const formattedDistance = useMemo(
    () => formatDistance(activityTask.distance, distanceMeasurementSystem),
    [activityTask.distance, distanceMeasurementSystem],
  );

  const { paceLabel, formattedPace } = useMemo(() => {
    if (activityType === ActivityType.RUNNING) {
      const pace = getPaceInMinutesPerKilometers(
        activityTask.distance,
        durationInSeconds,
        distanceMeasurementSystem,
      );

      return {
        paceLabel: i18n.t('recordActivity.pace'),
        formattedPace: formatPace(pace, distanceMeasurementSystem),
      };
    }

    const speed = getSpeedInKilometersPerHour(
      activityTask.distance,
      durationInSeconds,
      distanceMeasurementSystem,
    );

    return {
      paceLabel: i18n.t('recordActivity.speed'),
      formattedPace: formatSpeed(speed, distanceMeasurementSystem),
    };
  }, [activityTask.distance, activityType, durationInSeconds, distanceMeasurementSystem]);

  return (
    <Wrapper>
      <StatisticsWrapper>
        <StatisticWrapper>
          <StatTitle>{i18n.t('recordActivity.distance')}</StatTitle>
          <StatValue>{formattedDistance}</StatValue>
        </StatisticWrapper>
        <StatisticWrapper>
          <StatTitle>{paceLabel}</StatTitle>
          <StatValue>{formattedPace}</StatValue>
        </StatisticWrapper>
      </StatisticsWrapper>
      <StopWatchText>{formattedDuration}</StopWatchText>
    </Wrapper>
  );
};

export default ActivityStatistics;
