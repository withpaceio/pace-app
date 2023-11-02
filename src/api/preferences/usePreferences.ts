import { useCallback } from 'react';

import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { decryptDefaultActivityType } from '@activity';
import { type ProfileData, decryptMeasurement, useAuth } from '@auth';

import type { Preferences } from '@models/Preferences';
import { API_URL, sendGetRequest } from '@utils/sendRequest';

import preferencesKeys from './preferencesKeys';

export type PreferencesData = {
  id: string;
  defaultActivityType: string;
  measurement: string;
};

export function useQueryFn(): () => Promise<PreferencesData> {
  const { getTokens } = useAuth();

  return async () => {
    const { accessToken } = await getTokens();
    return sendGetRequest<PreferencesData>(`${API_URL}/api/preferences`, accessToken);
  };
}

export default function usePreferences(): UseQueryResult<Preferences, Error> {
  const { isRefreshingTokens, getProfileData } = useAuth();
  const queryFn = useQueryFn();

  return useQuery({
    queryKey: preferencesKeys.details(),
    queryFn,
    select: useCallback(
      (data: PreferencesData) => {
        const profileData = getProfileData() as ProfileData;

        const decryptedMeasurement = decryptMeasurement(
          data.measurement,
          profileData.keyPairs.encryptionKeyPair,
        );

        const decryptedDefaultActivityType = decryptDefaultActivityType(
          data.defaultActivityType,
          profileData.keyPairs.encryptionKeyPair,
        );

        return {
          id: data.id,
          defaultActivityType: decryptedDefaultActivityType,
          measurement: decryptedMeasurement,
        };
      },
      [getProfileData],
    ),
    enabled: !isRefreshingTokens(),
  });
}
