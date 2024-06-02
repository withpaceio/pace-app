import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { encryptProfilePicture, useAuth } from '@auth';

import type { UploadProfilePictureResponse } from '@models/Account';

import { API_URL, sendPostRequest, sendPutRequest } from '@utils/sendRequest';

import profilePictureKeys from './profilePictureKeys';

type Args = {
  profilePicture: string;
};

export function useMutationFn(): (args: Args) => Promise<void> {
  const { getProfileData, getAuthToken } = useAuth();

  return async ({ profilePicture }: Args) => {
    const profileData = getProfileData();
    if (profileData === null) {
      throw new Error('Profile data is null');
    }

    const { encryptedProfilePicture, profileEncryptionKey } = encryptProfilePicture(
      profilePicture,
      profileData.keyPairs.encryptionKeyPair,
    );

    const authToken = getAuthToken();
    const { url } = await sendPostRequest<UploadProfilePictureResponse>(
      `${API_URL}/api/account/profile-picture/upload`,
      authToken as string,
      { profileEncryptionKey },
    );

    await sendPutRequest(url, undefined, encryptedProfilePicture, 'application/octet-stream', true);
  };
}

export default function useUpdateProfilePicture(): UseMutationResult<void, unknown, Args, unknown> {
  const queryClient = useQueryClient();
  const mutationFn = useMutationFn();
  const { getProfileData } = useAuth();

  return useMutation({
    mutationKey: profilePictureKeys.update(),
    mutationFn,
    onMutate: async ({ profilePicture }) => {
      queryClient.cancelQueries({ queryKey: profilePictureKeys.details() });
      const previousProfilePicture = queryClient.getQueryData<string>([
        'account',
        'profilePicture',
      ]);

      const profileData = getProfileData();
      if (!profileData) {
        return { previousProfilePicture };
      }

      const { encryptedProfilePicture, profileEncryptionKey } = encryptProfilePicture(
        profilePicture,
        profileData.keyPairs.encryptionKeyPair,
      );

      queryClient.setQueryData(profilePictureKeys.details(), {
        encryptedProfilePicture,
        encryptionKey: profileEncryptionKey,
      });

      return { previousProfilePicture };
    },
    onError: (_, __, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(profilePictureKeys.details(), context.previousProfilePicture);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: profilePictureKeys.details(),
      });
    },
  });
}
