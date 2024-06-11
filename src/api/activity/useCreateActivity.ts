import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { decodeBase64 } from 'react-native-nacl-jsi';
import { v4 as uuidv4 } from 'uuid';

import { encryptActivity, encryptLocations, encryptMapSnapshot, uploadActivity } from '@activity';
import { useAuth } from '@auth';

import type { ActivityTimelineData } from '@api/activity/useActivityTimeline';

import type {
  ActivityLocation,
  ActivitySummary,
  CreateActivityResponse,
  EncryptedActivity,
  UploadActivityResponse,
} from '@models/Activity';

import { API_URL, sendGetRequest, sendPostRequest } from '@utils/sendRequest';

import activitiesKeys from './activitiesKeys';

type Args = {
  summary: ActivitySummary;
  locations: ActivityLocation[];
  mapSnapshot: string;
  mapSnapshotDark: string;
};

export function useMutationFn(): (
  args: Args,
) => Promise<{ id: string; activityEncryptionKey: string }> {
  const { getProfileData, getAuthToken } = useAuth();

  return async ({ summary, locations, mapSnapshot, mapSnapshotDark }: Args) => {
    const profileData = getProfileData();
    if (profileData === null) {
      throw new Error('Profile data is null');
    }

    const {
      activityEncryptionKey,
      encryptedActivityEncryptionKey,
      encryptedSummary,
      encryptedCreatedAt,
    } = encryptActivity(summary, profileData.keyPairs.encryptionKeyPair);
    const activityEncryptionKeyBuffer = decodeBase64(activityEncryptionKey);

    const encryptedLocations = encryptLocations(locations, activityEncryptionKeyBuffer);
    const encryptedMapSnapshot = encryptMapSnapshot(mapSnapshot, activityEncryptionKeyBuffer);
    const encryptedMapSnapshotDark = encryptMapSnapshot(
      mapSnapshotDark,
      activityEncryptionKeyBuffer,
    );

    const authToken = getAuthToken();
    const { id: activityId } = await sendPostRequest<CreateActivityResponse>(
      `${API_URL}/api/activities/create`,
      authToken as string,
      {
        summary: encryptedSummary,
        createdAt: encryptedCreatedAt,
        activityEncryptionKey: encryptedActivityEncryptionKey,
        hasLocations: true,
      },
    );

    const { url, mapUrlDark, mapUrlLight } = await sendGetRequest<UploadActivityResponse>(
      `${API_URL}/api/activities/${activityId}/upload`,
      authToken as string,
    );

    const result = await uploadActivity(
      encryptedLocations,
      url,
      encryptedMapSnapshotDark,
      mapUrlDark,
      encryptedMapSnapshot,
      mapUrlLight,
    );

    if (!result) {
      throw new Error('Failed to upload activity data');
    }

    return { id: activityId, activityEncryptionKey };
  };
}

export default function useCreateActivity(): UseMutationResult<
  { id: string; activityEncryptionKey: string },
  unknown,
  Args,
  unknown
> {
  const queryClient = useQueryClient();
  const {
    state: { userId },
    getProfileData,
  } = useAuth();
  const mutationFn = useMutationFn();

  return useMutation({
    mutationKey: activitiesKeys.create(),
    mutationFn,
    onMutate: async ({ summary, locations, mapSnapshot, mapSnapshotDark }) => {
      await queryClient.cancelQueries({ queryKey: activitiesKeys.timeline() });
      const previousTimeline = queryClient.getQueryData<ActivityTimelineData>(
        activitiesKeys.timeline(),
      );

      const profileData = getProfileData();
      if (!profileData) {
        return { previousTimeline, activity: null };
      }

      const {
        activityEncryptionKey,
        encryptedActivityEncryptionKey,
        encryptedCreatedAt,
        encryptedSummary,
      } = encryptActivity(summary, profileData.keyPairs.encryptionKeyPair);
      const activityEncryptionKeyBuffer = decodeBase64(activityEncryptionKey);

      const activity: EncryptedActivity = {
        id: uuidv4(),
        userId,
        summary: encryptedSummary,
        encryptionKey: encryptedActivityEncryptionKey,
        createdAt: encryptedCreatedAt,
        mapFileLocation: '',
      };

      queryClient.setQueryData(activitiesKeys.timeline(), {
        activities: [activity, ...(previousTimeline?.activities ?? [])],
        nextCursor: previousTimeline?.nextCursor ?? undefined,
      });

      queryClient.setQueryData(
        activitiesKeys.locations(activity.id, activityEncryptionKey),
        encryptLocations(locations, activityEncryptionKeyBuffer),
      );

      queryClient.setQueryData(
        activitiesKeys.mapSnapshot(activity.id, activityEncryptionKey, 'light'),
        encryptMapSnapshot(mapSnapshot, activityEncryptionKeyBuffer),
      );

      queryClient.setQueryData(
        activitiesKeys.mapSnapshot(activity.id, activityEncryptionKey, 'dark'),
        encryptMapSnapshot(mapSnapshotDark, activityEncryptionKeyBuffer),
      );

      return { previousTimeline, activity, activityEncryptionKey };
    },
    onError: (_, __, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(activitiesKeys.timeline(), context.previousTimeline);

      if (context.activity) {
        queryClient.removeQueries({
          queryKey: activitiesKeys.locations(context.activity.id, context.activityEncryptionKey),
        });
        queryClient.removeQueries({
          queryKey: activitiesKeys.mapSnapshot(
            context.activity.id,
            context.activityEncryptionKey,
            'light',
          ),
        });
        queryClient.removeQueries({
          queryKey: activitiesKeys.mapSnapshot(
            context.activity.id,
            context.activityEncryptionKey,
            'dark',
          ),
        });
      }
    },
    onSuccess: (data, _, context) => {
      if (!context?.activity) {
        return;
      }

      queryClient.setQueryData(
        activitiesKeys.locations(data.id, context.activityEncryptionKey),
        queryClient.getQueryData<string>(
          activitiesKeys.locations(context.activity.id, context.activityEncryptionKey),
        ),
      );
      queryClient.removeQueries({
        queryKey: activitiesKeys.locations(context.activity.id, context.activityEncryptionKey),
      });

      queryClient.setQueryData(
        activitiesKeys.mapSnapshot(data.id, context.activityEncryptionKey, 'light'),
        queryClient.getQueryData<string>(
          activitiesKeys.mapSnapshot(context.activity.id, context.activityEncryptionKey, 'light'),
        ),
      );
      queryClient.removeQueries({
        queryKey: activitiesKeys.mapSnapshot(
          context.activity.id,
          context.activityEncryptionKey,
          'light',
        ),
      });

      queryClient.setQueryData(
        activitiesKeys.mapSnapshot(data.id, context.activityEncryptionKey, 'dark'),
        queryClient.getQueryData<string>(
          activitiesKeys.mapSnapshot(context.activity.id, context.activityEncryptionKey, 'dark'),
        ),
      );
      queryClient.removeQueries({
        queryKey: activitiesKeys.mapSnapshot(
          context.activity.id,
          context.activityEncryptionKey,
          'dark',
        ),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: activitiesKeys.timeline() });
    },
  });
}
