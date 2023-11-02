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
  const { getTokens } = useAuth();

  return async () => {
    const { accessToken } = await getTokens();
    return sendGetRequest<HealthInformationData>(`${API_URL}/api/health-information`, accessToken);
  };
}

export default function useHealthInformation(): UseQueryResult<
  ReturnType<typeof decryptHealthInformation>,
  Error
> {
  const { getProfileData, isRefreshingTokens } = useAuth();
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
    enabled: !isRefreshingTokens(),
  });
}
