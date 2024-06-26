import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@auth';

import type { ActivityTimelineData } from '@api/activity/useActivityTimeline';

import { API_URL, sendDeleteRequest } from '@utils/sendRequest';

import activitiesKeys from './activitiesKeys';

type Args = {
  activityId: string;
};

export function useMutationFn(): (args: Args) => Promise<{ message: string }> {
  const { getAuthToken } = useAuth();

  return ({ activityId }: Args) => {
    const authToken = getAuthToken();

    return sendDeleteRequest<{ message: string }>(
      `${API_URL}/api/activities/${activityId}`,
      authToken as string,
    );
  };
}

export default function useDeleteActivity(): UseMutationResult<
  { message: string },
  unknown,
  Args,
  unknown
> {
  const queryClient = useQueryClient();
  const mutationFn = useMutationFn();

  return useMutation({
    mutationKey: activitiesKeys.delete(),
    mutationFn,
    onMutate: async ({ activityId }) => {
      await queryClient.cancelQueries({ queryKey: activitiesKeys.timeline() });
      const previousTimeline = queryClient.getQueryData<ActivityTimelineData>(
        activitiesKeys.timeline(),
      );

      const newTimelineActivities =
        previousTimeline?.activities.filter(({ id }) => id !== activityId) ?? [];

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
