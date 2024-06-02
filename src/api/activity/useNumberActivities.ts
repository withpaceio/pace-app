import { useCallback } from 'react';

import { type UseQueryResult } from '@tanstack/react-query';

import useActivityTimeline, {
  type EncryptedActivityTimelineData,
} from '@api/activity/useActivityTimeline';

export default function useNumberActivities(): UseQueryResult<number, Error> {
  const select = useCallback(
    (data: EncryptedActivityTimelineData): number => data.activities.length,
    [],
  );

  return useActivityTimeline<number>(select);
}
