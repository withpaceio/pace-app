import type { InfiniteData } from '@tanstack/react-query';

import type { Activity } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

export type Props = {
  data: InfiniteData<{ activities: Activity[]; nextCursor: string | undefined }> | undefined;
  isLoading: boolean;
  initialLoading: boolean;
  refreshing: boolean;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  onEndReached: () => void;
  onRefresh: () => void;
};
