import { useCallback } from 'react';

import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { decryptActivity } from '@activity';
import { type ProfileData, useAuth } from '@auth';

import type { Activity } from '@models/Activity';

import { API_URL, sendGetRequest } from '@utils/sendRequest';

import activitiesKeys from './activitiesKeys';

export type ActivityTimelineData = {
  activities: Activity[];
  nextCursor: string | undefined;
};

export default function useActivityTimeline<T = Activity[]>(
  select?: (data: ActivityTimelineData) => T,
): UseQueryResult<T, Error> {
  const { getTokens, getProfileData, isRefreshingTokens } = useAuth();

  const applySelect = useCallback(
    (data: ActivityTimelineData): T => {
      if (select) {
        return select(data);
      }

      const profileData = getProfileData() as ProfileData;
      // @ts-ignore
      return data.activities
        .map((activity) => decryptActivity(activity, profileData.keyPairs.encryptionKeyPair))
        .filter((activity) => activity.summary)
        .sort((activity1, activity2) => {
          if (activity1.createdAt < activity2.createdAt) {
            return 1;
          }
          if (activity1.createdAt > activity2.createdAt) {
            return -1;
          }
          return 0;
        });
    },
    [getProfileData, select],
  );

  return useQuery({
    queryKey: activitiesKeys.timeline(),
    queryFn: async () => {
      const { accessToken } = await getTokens();
      return sendGetRequest<ActivityTimelineData>(`${API_URL}/api/activities`, accessToken);
    },
    select: applySelect,
    enabled: !isRefreshingTokens(),
  });
}
