import React, { type FC } from 'react';

import { ActivityType } from '@models/Activity';

import CyclingStatistics from './CyclingStatistics';
import RunningStatistics from './RunningStatistics';
import type { ActivityStatisticsProps } from './types';

const ActivityStatistics: FC<ActivityStatisticsProps> = ({
  summary,
  locations,
  distanceMeasurementSystem,
}) => {
  switch (summary.type) {
    case ActivityType.RUNNING:
      return (
        <RunningStatistics
          summary={summary}
          locations={locations}
          distanceMeasurementSystem={distanceMeasurementSystem}
        />
      );
    case ActivityType.CYCLING:
      return (
        <CyclingStatistics
          summary={summary}
          locations={locations}
          distanceMeasurementSystem={distanceMeasurementSystem}
        />
      );
    default:
      return null;
  }
};

export default ActivityStatistics;
