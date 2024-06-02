import { useCallback } from 'react';

import { type InfiniteData, type UseQueryResult } from '@tanstack/react-query';

import { decryptActivity } from '@activity';
import { type ProfileData, useAuth } from '@auth';

import useActivityTimeline, {
  type ActivityTimelineData,
  type EncryptedActivityTimelineData,
} from '@api/activity/useActivityTimeline';

const PAGE_SIZE = 5;

export default function useActivities(
  page: number,
): UseQueryResult<InfiniteData<ActivityTimelineData>, Error> {
  const { getProfileData } = useAuth();

  const select = useCallback(
    (data: EncryptedActivityTimelineData) => {
      const profileData = getProfileData() as ProfileData;

      const paginatedData: InfiniteData<ActivityTimelineData> = {
        pages: [],
        pageParams: [],
      };

      let i = 0;
      while (i < (page + 1) * PAGE_SIZE) {
        const pageActivities = data.activities.slice(i, i + PAGE_SIZE);
        const nextCursor =
          i + PAGE_SIZE + 1 < data.activities.length
            ? data.activities[i + PAGE_SIZE + 1].id
            : undefined;

        paginatedData.pages.push({
          activities: pageActivities.map((activity) =>
            decryptActivity(activity, profileData.keyPairs.encryptionKeyPair),
          ),
          nextCursor,
        });
        paginatedData.pageParams.push(nextCursor);
        i += PAGE_SIZE;
      }

      return paginatedData;
    },
    [getProfileData, page],
  );

  return useActivityTimeline<InfiniteData<ActivityTimelineData>>(select);
}
