import { useCallback } from 'react';

import { type UseQueryResult } from '@tanstack/react-query';

import { decryptActivity } from '@activity';
import { type ProfileData, useAuth } from '@auth';

import useActivityTimeline, { type ActivityTimelineData } from '@api/activity/useActivityTimeline';

import type { Activity } from '@models/Activity';

export default function useActivity(id: string | undefined): UseQueryResult<Activity, Error> {
  const { getProfileData } = useAuth();

  const select = useCallback(
    (data: ActivityTimelineData): Activity | undefined => {
      if (!id) {
        return undefined;
      }

      const profileData = getProfileData() as ProfileData;
      const activity = data.activities.find(({ id: activityId }) => activityId === id) as Activity;
      return decryptActivity(activity, profileData.keyPairs.encryptionKeyPair);
    },
    [getProfileData, id],
  );

  return useActivityTimeline<Activity>(select);
}
