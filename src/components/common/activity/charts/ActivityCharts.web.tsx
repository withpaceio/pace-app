import type { ComponentType, FC } from 'react';

import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

import { ActivityType } from '@models/Activity';

type Props = {
  activityType: ActivityType;
};

function getChartComponent(activityType: ActivityType): Promise<{ default: ComponentType }> {
  let component;
  switch (activityType) {
    case ActivityType.CYCLING:
      component = import('./cycling/CyclingCharts');
      break;
    case ActivityType.RUNNING:
    default:
      component = import('./running/RunningCharts');
      break;
  }
  return component;
}

const ActivityCharts: FC<Props> = ({ activityType }) => {
  return (
    <WithSkiaWeb
      opts={{ locateFile: (file) => `/web/static/js/${file}` }}
      getComponent={() => getChartComponent(activityType)}
      fallback={<div>loading</div>}
    />
  );
};

export default ActivityCharts;
