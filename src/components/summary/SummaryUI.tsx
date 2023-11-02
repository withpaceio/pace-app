import React, { FC, useCallback, useMemo, useState } from 'react';

import styled from 'styled-components/native';

import type { Activity, ActivitySummary } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import SummaryActivityList from './SummaryActivityList';
import SummaryTileList from './SummaryTileList';

const Wrapper = styled.View`
  flex: 1;
`;

const ContentWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

type Props = {
  today: Date;
  timePeriods: { start: Date; end: Date }[];
  activities: Activity[] | undefined;
  period: 'week' | 'month';
  distanceMeasurementSystem: DistanceMeasurementSystem;
  onLoadTimePeriodActivities: (
    startDate: Date | undefined,
    endDate: Date | undefined,
  ) => Promise<void>;
};

const SummaryUI: FC<Props> = ({
  today,
  timePeriods,
  activities,
  period,
  distanceMeasurementSystem,
  onLoadTimePeriodActivities,
}) => {
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);
  const [visibleTimePeriod, setVisibleTimePeriod] = useState<{ start: Date; end: Date } | null>(
    null,
  );

  const timePeriodActivities = useMemo(() => {
    if (!activities || !visibleTimePeriod) {
      return null;
    }

    return activities.filter(({ summary }) => {
      const createdAtDate = new Date((summary as ActivitySummary).createdAt);
      return createdAtDate >= visibleTimePeriod.start && createdAtDate <= visibleTimePeriod.end;
    });
  }, [activities, visibleTimePeriod]);

  const onVisibleTimePeriodChanged = useCallback(
    (start: Date, end: Date): void => {
      setSelectedActivityIds([]);
      setVisibleTimePeriod({ start, end });
      onLoadTimePeriodActivities(start, end);
    },
    [onLoadTimePeriodActivities],
  );

  return (
    <Wrapper>
      <ContentWrapper>
        <SummaryTileList
          today={today}
          timePeriods={timePeriods}
          activities={timePeriodActivities}
          period={period}
          distanceMeasurementSystem={distanceMeasurementSystem}
          onSelectedActivities={setSelectedActivityIds}
          onVisibleTimePeriodChanged={onVisibleTimePeriodChanged}
        />
      </ContentWrapper>
      <SummaryActivityList
        activities={timePeriodActivities}
        selectedActivityIds={selectedActivityIds}
        distanceMeasurementSystem={distanceMeasurementSystem}
      />
    </Wrapper>
  );
};

export default SummaryUI;
