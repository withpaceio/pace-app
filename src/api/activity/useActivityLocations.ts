import { useCallback } from 'react';

import { type UseQueryResult, useQuery, useQueryClient } from '@tanstack/react-query';

import { decryptLocations } from '@activity';
import { useAuth } from '@auth';

import type { ActivityLocation } from '@models/Activity';

import { API_URL, sendGetRequest } from '@utils/sendRequest';

import activitiesKeys from './activitiesKeys';

type Args = {
  activityId: string | undefined;
  activityEncryptionKey: string | undefined;
};

export default function useActivityLocations({
  activityId,
  activityEncryptionKey,
}: Args): UseQueryResult<{ locations: ActivityLocation[] }, Error> {
  const queryClient = useQueryClient();
  const { getAuthToken } = useAuth();

  const queryKey = activitiesKeys.locations(activityId, activityEncryptionKey);

  return useQuery({
    queryKey: activitiesKeys.locations(activityId, activityEncryptionKey),
    queryFn: async () => {
      const authToken = getAuthToken();
      const response = await sendGetRequest<{ url: string }>(
        `${API_URL}/api/activities/${activityId}/locations`,
        authToken as string,
      );

      return sendGetRequest<string>(response.url, undefined, 'application/octet-stream');
    },
    select: useCallback(
      (data: string) => {
        const decryptedLocations = decryptLocations(data, activityEncryptionKey!);
        return { locations: decryptedLocations };
      },
      [activityEncryptionKey],
    ),
    enabled:
      Boolean(getAuthToken()) &&
      Boolean(activityId && activityEncryptionKey) &&
      !queryClient.getQueryData(queryKey),
  });
}
