import React, { type FC, useCallback, useMemo, useState } from 'react';

import {
  differenceInCalendarMonths,
  endOfMonth,
  startOfDay,
  startOfMonth,
  subMinutes,
  subMonths,
} from 'date-fns';

import { useAuth } from '@auth';

import useActivitiesByIds from '@api/activity/useActivitiesByIds';
import useActivityTimeline from '@api/activity/useActivityTimeline';
import usePreferences from '@api/preferences/usePreferences';

import SummaryUI from '@components/summary/SummaryUI';

import { DistanceMeasurementSystem } from '@models/UnitSystem';

const MonthlySummaryScreen: FC = () => {
  const [activityIds, setActivityIds] = useState<string[]>([]);

  const {
    state: { createdAt },
  } = useAuth();

  const { data: preferencesData } = usePreferences();
  const { data: activityTimelineData } = useActivityTimeline();
  const { data: activitiesData } = useActivitiesByIds(activityIds);

  const today = useMemo(() => {
    const date = new Date();
    return subMinutes(startOfDay(date), date.getTimezoneOffset());
  }, []);

  const monthsSinceJoined = useMemo(() => {
    if (!createdAt) {
      return [];
    }

    let startMonthDate = subMinutes(startOfMonth(today), today.getTimezoneOffset());

    const months = [];
    while (differenceInCalendarMonths(startMonthDate, createdAt) >= 0) {
      const lastMonthDate = endOfMonth(startMonthDate);
      months.push({ start: startMonthDate, end: lastMonthDate });
      startMonthDate = subMonths(startMonthDate, 1);
    }

    return months;
  }, [today, createdAt]);

  const onLoadMonthActivities = useCallback(
    async (startDate: Date | undefined, endDate: Date | undefined): Promise<void> => {
      if (!startDate || !endDate || !activityTimelineData) {
        return;
      }

      const activityIdsToLoad = activityTimelineData
        .filter(({ createdAt: activityCreatedAt }) => {
          const createdAtDate = new Date(activityCreatedAt);
          return createdAtDate >= startDate && createdAtDate <= endDate;
        })
        .map(({ id }) => id);

      setActivityIds(activityIdsToLoad);
    },
    [activityTimelineData],
  );

  return (
    <SummaryUI
      today={today}
      timePeriods={monthsSinceJoined}
      activities={activitiesData}
      period="month"
      distanceMeasurementSystem={preferencesData?.measurement || DistanceMeasurementSystem.METRIC}
      onLoadTimePeriodActivities={onLoadMonthActivities}
    />
  );
};

export default MonthlySummaryScreen;
