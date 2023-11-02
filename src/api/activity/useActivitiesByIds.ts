import { useCallback } from 'react';

import { type UseQueryResult } from '@tanstack/react-query';

import { decryptActivity } from '@activity';
import { type ProfileData, useAuth } from '@auth';

import useActivityTimeline, { type ActivityTimelineData } from '@api/activity/useActivityTimeline';

import type { Activity } from '@models/Activity';

export default function useActivitiesByIds(
  activitiesIds: string[],
): UseQueryResult<Activity[], Error> {
  const { getProfileData } = useAuth();

  const select = useCallback(
    (data: ActivityTimelineData): Activity[] => {
      const profileData = getProfileData() as ProfileData;

      return data.activities
        .filter(({ id }) => activitiesIds.includes(id))
        .map((activity) => decryptActivity(activity, profileData.keyPairs.encryptionKeyPair));
    },
    [activitiesIds, getProfileData],
  );

  return useActivityTimeline<Activity[]>(select);
}
