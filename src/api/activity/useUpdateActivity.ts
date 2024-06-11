import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { decodeBase64 } from 'react-native-nacl-jsi';

import { encryptSummary } from '@activity';
import { useAuth } from '@auth';

import type { ActivityTimelineData } from '@api/activity/useActivityTimeline';

import type { ActivitySummary } from '@models/Activity';

import { API_URL, sendPostRequest } from '@utils/sendRequest';

import activitiesKeys from './activitiesKeys';

type Args = {
  activityId: string;
  summary: ActivitySummary;
  activityEncryptionKey: string;
};

export function useMutationFn(): (args: Args) => Promise<{ message: string }> {
  const { getAuthToken } = useAuth();

  return ({ activityId, summary, activityEncryptionKey }: Args) => {
    const encryptedSummary = encryptSummary(summary, decodeBase64(activityEncryptionKey));

    const authToken = getAuthToken();
    return sendPostRequest<{ message: string }>(
      `${API_URL}/api/activities/${activityId}/update`,
      authToken as string,
      { summary: encryptedSummary },
    );
  };
}

export default function useUpdateActivity(): UseMutationResult<
  { message: string },
  unknown,
  Args,
  unknown
> {
  const queryClient = useQueryClient();
  const mutationFn = useMutationFn();

  return useMutation({
    mutationKey: activitiesKeys.update(),
    mutationFn,
    onMutate: async ({ activityId, summary, activityEncryptionKey }) => {
      await queryClient.cancelQueries({ queryKey: activitiesKeys.timeline() });
      const previousTimeline = queryClient.getQueryData<ActivityTimelineData>(
        activitiesKeys.timeline(),
      );

      const encryptedSummary = encryptSummary(summary, decodeBase64(activityEncryptionKey));
      const newTimelineActivities =
        previousTimeline?.activities.map((activity) => {
          if (activity.id !== activityId) {
            return activity;
          }

          return {
            ...activity,
            summary: encryptedSummary,
          };
        }) ?? [];

      queryClient.setQueryData(activitiesKeys.timeline(), {
        activities: newTimelineActivities,
        nextCursor:
          previousTimeline?.nextCursor === activityId ? undefined : previousTimeline?.nextCursor,
      });

      return { previousTimeline };
    },
    onError: (_, __, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(activitiesKeys.timeline(), context.previousTimeline);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: activitiesKeys.timeline() });
    },
  });
}
