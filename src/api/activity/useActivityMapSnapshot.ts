import { useCallback } from 'react';

import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { decryptMapSnapshot } from '@activity';
import { useAuth } from '@auth';

import { API_URL, sendGetRequest } from '@utils/sendRequest';

import activitiesKeys from './activitiesKeys';

type Args = {
  activityId: string | undefined;
  activityEncryptionKey: string | undefined;
  mapSnapshotTheme: 'light' | 'dark';
};

export default function useActivityMapSnapshot({
  activityId,
  activityEncryptionKey,
  mapSnapshotTheme,
}: Args): UseQueryResult<{ mapSnapshot: string }, Error> {
  const { getTokens, isRefreshingTokens } = useAuth();

  return useQuery({
    queryKey: activitiesKeys.mapSnapshot(activityId, activityEncryptionKey, mapSnapshotTheme),
    queryFn: async () => {
      const { accessToken } = await getTokens();
      const response = await sendGetRequest<{ url: string }>(
        `${API_URL}/api/activities/${activityId}/map-snapshot?theme=${mapSnapshotTheme}`,
        accessToken,
      );

      return sendGetRequest<string>(response.url, undefined, 'application/octet-stream');
    },
    select: useCallback(
      (data: string) => {
        const decryptedMapSnapshot = decryptMapSnapshot(data, activityEncryptionKey as string);

        return { mapSnapshot: decryptedMapSnapshot };
      },
      [activityEncryptionKey],
    ),
    enabled:
      !isRefreshingTokens() && Boolean(activityId && activityEncryptionKey && mapSnapshotTheme),
  });
}
