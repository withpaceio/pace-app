import { useCallback } from 'react';

import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { type ProfileData, decryptHealthInformation, useAuth } from '@auth';

import { API_URL, sendGetRequest } from '@utils/sendRequest';

import healthInformationKeys from './healthInformationKeys';

export type HealthInformationData = {
  healthInformation: string | null;
  encryptionKey: string | null;
} | null;

export function useQueryFn(): () => Promise<HealthInformationData> {
  const { getAuthToken } = useAuth();

  return () => {
    const authToken = getAuthToken();
    return sendGetRequest<HealthInformationData>(
      `${API_URL}/api/health-information`,
      authToken as string,
    );
  };
}

export default function useHealthInformation(): UseQueryResult<
  ReturnType<typeof decryptHealthInformation>,
  Error
> {
  const { getProfileData, getAuthToken } = useAuth();
  const queryFn = useQueryFn();

  return useQuery({
    queryKey: healthInformationKeys.details(),
    queryFn,
    select: useCallback(
      (data: HealthInformationData) => {
        if (!data || !data.healthInformation || !data.encryptionKey) {
          return null;
        }

        const profileData = getProfileData() as ProfileData;

        return decryptHealthInformation(
          data.healthInformation,
          data.encryptionKey,
          profileData.keyPairs.encryptionKeyPair,
        );
      },
      [getProfileData],
    ),
    enabled: Boolean(getAuthToken()),
  });
}
