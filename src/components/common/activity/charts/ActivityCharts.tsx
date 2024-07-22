import type { FC } from 'react';

import { ActivityType } from '@models/Activity';

import CyclingCharts from './cycling/CyclingCharts';
import RunningCharts from './running/RunningCharts';

type Props = {
  activityType: ActivityType;
};

const ActivityCharts: FC<Props> = ({ activityType }) => {
  switch (activityType) {
    case ActivityType.RUNNING:
      return <RunningCharts />;
    case ActivityType.CYCLING:
      return <CyclingCharts />;
    default:
      return null;
  }
};

export default ActivityCharts;
