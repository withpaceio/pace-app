import React, { type FC } from 'react';

import { CyclingIcon, type IconProps, RunningIcon } from '@components/icons';

import { ActivityType } from '@models/Activity';

type Props = IconProps & {
  activityType: ActivityType;
};

const ActivityIcon: FC<Props> = ({ activityType, ...iconProps }) => {
  switch (activityType) {
    case ActivityType.RUNNING:
      return <RunningIcon {...iconProps} />;
    case ActivityType.CYCLING:
      return <CyclingIcon {...iconProps} />;
    default:
      return null;
  }
};

export default ActivityIcon;
