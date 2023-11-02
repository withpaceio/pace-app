import React, { type FC, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';

import {
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  format,
  startOfMonth,
  startOfWeek,
  subMinutes,
} from 'date-fns';
import styled from 'styled-components/native';

import { formatDistance, formatDuration } from '@activity';

import { Text } from '@components/ui';

import type { Activity, ActivitySummary } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';
import i18n from '@translations/i18n';

import DistanceBarChart from './DistanceBarChart';

const Wrapper = styled.View<{ width: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: ${({ width, theme }) => width - 2 * theme.sizes.outerPadding}px;
  margin-left: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-right: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-top: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const ContentWrapper = styled.View`
  width: 100%;
  padding: ${({ theme }) => theme.sizes.outerPadding}px;

  background-color: ${({ theme }) => theme.colors.background};

  shadow-color: ${({ theme }) => theme.colors.black};
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  shadow-offset: 0px 5px;
  elevation: 4;

  border-radius: 8px;
`;

const Title = styled(Text)`
  font-size: 22px;
  font-weight: bold;
`;

const DatePeriod = styled(Text)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`;

const StatisticsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  margin-top: ${({ theme }) => theme.sizes.outerPadding + 10}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
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

type Props = {
  today: Date;
  startDate: Date;
  endDate: Date;
  activities: Activity[] | null | undefined;
  period: 'week' | 'month';
  distanceMeasurementSystem: DistanceMeasurementSystem;
  onSelectActivities: (selectedActivityId: string[]) => void;
};

const SummaryTile: FC<Props> = ({
  today,
  startDate,
  endDate,
  activities,
  period,
  distanceMeasurementSystem,
  onSelectActivities,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { width: windowWidth } = useWindowDimensions();

  const datePeriod = useMemo(() => {
    if (period === 'week') {
      return `${format(startDate, 'MMMM do')} - ${format(endDate, 'MMMM do')}`;
    }

    return format(startDate, 'MMMM y');
  }, [startDate, endDate, period]);

  const timeDistance = useMemo(() => {
    if (period === 'week') {
      return differenceInCalendarWeeks(
        subMinutes(startOfWeek(today, { weekStartsOn: 1 }), today.getTimezoneOffset()),
        startDate,
      );
    }

    return differenceInCalendarMonths(
      subMinutes(startOfMonth(today), today.getTimezoneOffset()),
      startDate,
    );
  }, [today, startDate, period]);

  const { numberActivities, distance, duration } = useMemo(() => {
    if (!activities) {
      return { numberActivities: '-', distance: '-', duration: '-' };
    }

    const stats = activities.reduce(
      ({ distance: totalDistance, duration: totalDuration }, { summary }) => ({
        distance: totalDistance + (summary as ActivitySummary).distance,
        duration: totalDuration + (summary as ActivitySummary).duration,
      }),
      { distance: 0, duration: 0 },
    );

    return {
      numberActivities: activities.length,
      distance: formatDistance(stats.distance, distanceMeasurementSystem, true),
      duration: formatDuration(stats.duration, true),
    };
  }, [activities, distanceMeasurementSystem]);

  const onSelectedDate = (date: Date, selectedActivityIds: string[]): void => {
    setSelectedDate(date);
    onSelectActivities(selectedActivityIds);
  };

  return (
    <Wrapper width={windowWidth}>
      <ContentWrapper>
        {timeDistance === 0 && (
          <Title>
            {i18n.t(period === 'week' ? 'summary.weekly.thisWeek' : 'summary.monthly.thisMonth')}
          </Title>
        )}
        {timeDistance === 1 && (
          <Title>
            {i18n.t(period === 'week' ? 'summary.weekly.lastWeek' : 'summary.monthly.lastMonth')}
          </Title>
        )}
        {timeDistance > 1 && (
          <Title>
            {i18n.t(period === 'week' ? 'summary.weekly.weeksAgo' : 'summary.monthly.monthsAgo', {
              distance: timeDistance,
            })}
          </Title>
        )}
        <DatePeriod>{datePeriod}</DatePeriod>
        <StatisticsWrapper>
          <StatisticWrapper>
            <StatisticTitle>{i18n.t('summary.activities')}</StatisticTitle>
            <StatisticValueText>{numberActivities}</StatisticValueText>
          </StatisticWrapper>
          <StatisticWrapper>
            <StatisticTitle>{i18n.t('summary.distance')}</StatisticTitle>
            <StatisticValueText>{distance}</StatisticValueText>
          </StatisticWrapper>
          <StatisticWrapper>
            <StatisticTitle>{i18n.t('summary.duration')}</StatisticTitle>
            <StatisticValueText>{duration}</StatisticValueText>
          </StatisticWrapper>
        </StatisticsWrapper>
        <DistanceBarChart
          activities={activities || []}
          today={today}
          startDate={startDate}
          endDate={endDate}
          selectedDate={selectedDate}
          onSelectedDate={onSelectedDate}
        />
      </ContentWrapper>
    </Wrapper>
  );
};

export default SummaryTile;
