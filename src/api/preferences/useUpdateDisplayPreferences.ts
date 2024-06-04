import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { encryptMeasurement, useAuth } from '@auth';

import type { PreferencesData } from '@api/preferences/usePreferences';

import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import { API_URL, sendPatchRequest } from '@utils/sendRequest';

import preferencesKeys from './preferencesKeys';

type Args = {
  measurement: DistanceMeasurementSystem;
};

export function useMutationFn(): (args: Args) => Promise<{ message: string }> {
  const { getProfileData, getAuthToken } = useAuth();

  return ({ measurement }: Args) => {
    const profileData = getProfileData();
    if (profileData === null) {
      throw new Error('Profile data is null');
    }

    const encryptedMeasurement = encryptMeasurement(
      measurement,
      profileData.keyPairs.encryptionKeyPair,
    );

    const authToken = getAuthToken();
    return sendPatchRequest<{ message: string }>(
      `${API_URL}/api/preferences`,
      authToken as string,
      {
        measurement: encryptedMeasurement,
      },
    );
  };
}

export default function useUpdateDisplayPreferences(): UseMutationResult<
  { message: string },
  unknown,
  Args,
  unknown
> {
  const queryClient = useQueryClient();
  const mutationFn = useMutationFn();
  const { getProfileData } = useAuth();

  return useMutation({
    mutationKey: preferencesKeys.updateDisplayPreferences(),
    mutationFn,
    onMutate: async ({ measurement }) => {
      await queryClient.cancelQueries({ queryKey: preferencesKeys.details() });
      const previousPreferences = queryClient.getQueryData<PreferencesData>(
        preferencesKeys.details(),
      );

      const profileData = getProfileData();
      if (!profileData || !previousPreferences) {
        return { previousPreferences };
      }

      const newPreferences: PreferencesData = {
        ...previousPreferences,
        measurement: encryptMeasurement(measurement, profileData.keyPairs.encryptionKeyPair),
      };

      queryClient.setQueryData(preferencesKeys.details(), newPreferences);

      return { previousPreferences };
    },
    onError: (_, __, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(preferencesKeys.details(), context.previousPreferences);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: preferencesKeys.details() });
    },
  });
}
