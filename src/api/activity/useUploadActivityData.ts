import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { encryptLocations, encryptMapSnapshot, uploadActivity } from '@activity';
import { useAuth } from '@auth';

import type { ActivityLocation, UploadActivityResponse } from '@models/Activity';
import { API_URL, sendGetRequest } from '@utils/sendRequest';

import activitiesKeys from './activitiesKeys';

type Args = {
  activityId: string;
  activityEncryptionKey: string;
  locations: ActivityLocation[];
  mapSnapshot: string;
  mapSnapshotDark: string;
};

export default function useUploadActivityData(): UseMutationResult<void, unknown, Args, unknown> {
  const queryClient = useQueryClient();
  const { getTokens, getProfileData } = useAuth();

  return useMutation({
    mutationKey: activitiesKeys.uploadData(),
    mutationFn: async ({
      activityId,
      activityEncryptionKey,
      locations,
      mapSnapshot,
      mapSnapshotDark,
    }) => {
      const profileData = getProfileData();
      if (profileData === null) {
        throw new Error('Profile data is null');
      }

      const encryptedLocations = encryptLocations(locations, activityEncryptionKey);
      const encryptedMapSnapshot = encryptMapSnapshot(mapSnapshot, activityEncryptionKey);
      const encryptedMapSnapshotDark = encryptMapSnapshot(mapSnapshotDark, activityEncryptionKey);

      const { accessToken } = await getTokens();
      const { url, mapUrlDark, mapUrlLight } = await sendGetRequest<UploadActivityResponse>(
        `${API_URL}/api/activities/${activityId}/upload`,
        accessToken,
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
    },
    onMutate: async ({
      activityId,
      activityEncryptionKey,
      locations,
      mapSnapshot,
      mapSnapshotDark,
    }) => {
      await queryClient.cancelQueries({
        queryKey: activitiesKeys.locations(activityId, activityEncryptionKey),
      });

      await queryClient.cancelQueries({
        queryKey: activitiesKeys.mapSnapshot(activityId, activityEncryptionKey, 'light'),
      });

      await queryClient.cancelQueries({
        queryKey: activitiesKeys.mapSnapshot(activityId, activityEncryptionKey, 'dark'),
      });

      const previousLocations = queryClient.getQueryData(
        activitiesKeys.locations(activityId, activityEncryptionKey),
      );

      const previousMapSnapshotLight = queryClient.getQueryData(
        activitiesKeys.mapSnapshot(activityId, activityEncryptionKey, 'light'),
      );

      const previousMapSnapshotDark = queryClient.getQueryData(
        activitiesKeys.mapSnapshot(activityId, activityEncryptionKey, 'dark'),
      );

      queryClient.setQueryData(
        activitiesKeys.locations(activityId, activityEncryptionKey),
        encryptLocations(locations, activityEncryptionKey),
      );

      queryClient.setQueryData(
        activitiesKeys.mapSnapshot(activityId, activityEncryptionKey, 'light'),
        encryptMapSnapshot(mapSnapshot, activityEncryptionKey),
      );

      queryClient.setQueryData(
        activitiesKeys.mapSnapshot(activityId, activityEncryptionKey, 'dark'),
        encryptMapSnapshot(mapSnapshotDark, activityEncryptionKey),
      );

      return { previousLocations, previousMapSnapshotLight, previousMapSnapshotDark };
    },
    onError: (_, { activityId, activityEncryptionKey }, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(
        activitiesKeys.locations(activityId, activityEncryptionKey),
        context.previousLocations,
      );

      queryClient.setQueryData(
        activitiesKeys.mapSnapshot(activityId, activityEncryptionKey, 'light'),
        context.previousMapSnapshotLight,
      );

      queryClient.setQueryData(
        activitiesKeys.mapSnapshot(activityId, activityEncryptionKey, 'dark'),
        context.previousMapSnapshotDark,
      );
    },
    onSettled: (_, __, { activityId, activityEncryptionKey }) => {
      queryClient.invalidateQueries({
        queryKey: activitiesKeys.locations(activityId, activityEncryptionKey),
      });

      queryClient.invalidateQueries({
        queryKey: activitiesKeys.mapSnapshot(activityId, activityEncryptionKey, 'light'),
      });

      queryClient.invalidateQueries({
        queryKey: activitiesKeys.mapSnapshot(activityId, activityEncryptionKey, 'dark'),
      });
    },
  });
}
