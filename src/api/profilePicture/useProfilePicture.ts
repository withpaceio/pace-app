import { useCallback } from 'react';

import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { type ProfileData, decryptProfilePicture, useAuth } from '@auth';

import { API_URL, sendGetRequest } from '@utils/sendRequest';

import profilePictureKeys from './profilePictureKeys';

type ProfilePictureData =
  | { encryptedProfilePicture: string; encryptionKey: string }
  | { encryptedProfilePicture: null; encryptionKey: null };

export function useQueryFn(): () => Promise<ProfilePictureData> {
  const { getTokens } = useAuth();

  return async () => {
    const { accessToken } = await getTokens();
    const { url, encryptionKey } = await sendGetRequest<{
      url: string | null;
      encryptionKey: string | null;
    }>(`${API_URL}/api/account/profile-picture`, accessToken);

    if (!url || !encryptionKey) {
      return { encryptedProfilePicture: null, encryptionKey: null };
    }

    const encryptedProfilePicture = await sendGetRequest<string>(
      url,
      undefined,
      'application/octet-stream',
    );

    return { encryptedProfilePicture, encryptionKey };
  };
}

export default function useProfilePicture(): UseQueryResult<string | null, Error> {
  const { getProfileData, isRefreshingTokens } = useAuth();
  const queryFn = useQueryFn();

  return useQuery({
    queryKey: profilePictureKeys.details(),
    queryFn,
    select: useCallback(
      (data: ProfilePictureData): string | null => {
        if (data.encryptedProfilePicture === null || data.encryptionKey === null) {
          return null;
        }

        const profileData = getProfileData() as ProfileData;

        const decryptedProfilePicture = decryptProfilePicture(
          data.encryptedProfilePicture,
          data.encryptionKey,
          profileData.keyPairs.encryptionKeyPair,
        );

        return decryptedProfilePicture.picture;
      },
      [getProfileData],
    ),
    enabled: !isRefreshingTokens(),
  });
}
