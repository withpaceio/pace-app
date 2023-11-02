import React, { type FC, useMemo } from 'react';

import styled from 'styled-components/native';

import { formatDistance, formatDuration } from '@activity';

import useActivitiesByIds from '@api/activity/useActivitiesByIds';
import useActivityTimeline from '@api/activity/useActivityTimeline';

import { ActivityIndicator, Text } from '@components/ui';

import type { ActivitySummary } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';
import i18n from '@translations/i18n';

const Wrapper = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  width: 100%;

  padding: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;

  background-color: ${({ theme }) => theme.colors.componentBackground};

  shadow-color: ${({ theme }) => theme.colors.black};
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  shadow-offset: 0px 5px;
  elevation: 4;

  border-radius: 8px;
`;

const TitleWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Title = styled(Text)`
  font-size: 22px;
  font-weight: bold;
`;

const DateText = styled(Text)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};

  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
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

const StatisticTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 3px;
`;

const StatisticValueText = styled(Text)`
  font-size: 18px;
  font-weight: bold;
`;

const DistanceWrapper = styled(StatisticWrapper)`
  margin-left: 15px;
  margin-right: 15px;
`;

type Props = {
  title: string;
  subTitle: string;
  startDate: Date;
  endDate: Date;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  onPress: () => void;
};

const TrainingLogSummary: FC<Props> = ({
  title,
  subTitle,
  startDate,
  endDate,
  distanceMeasurementSystem,
  onPress,
}) => {
  const { data: activityTimelineData } = useActivityTimeline();

  const activitiesIds = useMemo(() => {
    if (!activityTimelineData) {
      return [];
    }

    return activityTimelineData
      .filter(({ createdAt }) => {
        const createdAtDate = new Date(createdAt);
        return createdAtDate >= startDate && createdAtDate <= endDate;
      })
      .map(({ id }) => id);
  }, [activityTimelineData, endDate, startDate]);

  const { data: activitiesData } = useActivitiesByIds(activitiesIds);

  const { distance, duration } = useMemo(() => {
    if (!activitiesData) {
      return { distance: '-', duration: '-' };
    }

    const stats = activitiesData.reduce(
      ({ distance: totalDistance, duration: totalDuration }, { summary }) => ({
        distance: totalDistance + (summary as ActivitySummary).distance,
        duration: totalDuration + (summary as ActivitySummary).duration,
      }),
      { distance: 0, duration: 0 },
    );

    return {
      distance: formatDistance(stats.distance, distanceMeasurementSystem, true),
      duration: formatDuration(stats.duration, true),
    };
  }, [activitiesData, distanceMeasurementSystem]);

  return (
    <Wrapper onPress={onPress}>
      <TitleWrapper>
        <Title>{title}</Title>
        <DateText>{subTitle}</DateText>
      </TitleWrapper>
      {activitiesData ? (
        <StatisticsWrapper>
          <StatisticWrapper>
            <StatisticTitle>{i18n.t('account.activities')}</StatisticTitle>
            <StatisticValueText>{activitiesData.length}</StatisticValueText>
          </StatisticWrapper>
          <DistanceWrapper>
            <StatisticTitle>{i18n.t('account.distance')}</StatisticTitle>
            <StatisticValueText>{distance}</StatisticValueText>
          </DistanceWrapper>
          <StatisticWrapper>
            <StatisticTitle>{i18n.t('account.duration')}</StatisticTitle>
            <StatisticValueText>{duration}</StatisticValueText>
          </StatisticWrapper>
        </StatisticsWrapper>
      ) : (
        <ActivityIndicator />
      )}
    </Wrapper>
  );
};

export default TrainingLogSummary;
