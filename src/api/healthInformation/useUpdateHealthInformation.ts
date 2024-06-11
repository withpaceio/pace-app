import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { convertPoundsToKilograms } from '@activity';
import { encryptHealthInformation, useAuth } from '@auth';

import type { HealthInformationData } from '@api/healthInformation/useHealthInformation';

import type { HealthInformation } from '@models/HealthInformation';
import type { Preferences } from '@models/Preferences';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import { API_URL, sendPatchRequest } from '@utils/sendRequest';

import healthInformationKeys from './healthInformationKeys';

type Args = {
  healthInformation: HealthInformation;
  encryptionKey: string | undefined;
  preferences: Preferences | undefined;
};

export function useMutationFn(): (args: Args) => Promise<{ message: string }> {
  const { getProfileData, getAuthToken } = useAuth();

  return ({ healthInformation, encryptionKey, preferences }: Args) => {
    const profileData = getProfileData();
    if (profileData === null) {
      throw new Error('Profile data is null');
    }

    const { encryptedHealthInformationEncryptionKey, encryptedHealthInformation } =
      encryptHealthInformation(
        {
          ...healthInformation,
          weight:
            preferences?.measurement === DistanceMeasurementSystem.IMPERIAL
              ? convertPoundsToKilograms(healthInformation.weight)
              : healthInformation.weight,
        },
        encryptionKey || null,
        profileData.keyPairs.encryptionKeyPair,
      );

    const authToken = getAuthToken();
    return sendPatchRequest<{ message: string }>(
      `${API_URL}/api/health-information`,
      authToken as string,
      {
        healthInformation: encryptedHealthInformation,
        encryptionKey: encryptedHealthInformationEncryptionKey,
      },
    );
  };
}

export default function useUpdateHealthInformation(): UseMutationResult<
  { message: string },
  unknown,
  Args,
  unknown
> {
  const queryClient = useQueryClient();
  const mutationFn = useMutationFn();
  const { getProfileData } = useAuth();

  return useMutation({
    mutationFn,
    mutationKey: healthInformationKeys.update(),
    onMutate: async ({ healthInformation, encryptionKey, preferences }) => {
      await queryClient.cancelQueries({ queryKey: healthInformationKeys.details() });
      const previousHealthInformation = queryClient.getQueryData<HealthInformation>(
        healthInformationKeys.details(),
      );

      const profileData = getProfileData();
      if (!profileData) {
        return { previousHealthInformation };
      }

      const { encryptedHealthInformationEncryptionKey, encryptedHealthInformation } =
        encryptHealthInformation(
          {
            ...healthInformation,
            weight:
              preferences?.measurement === DistanceMeasurementSystem.IMPERIAL
                ? convertPoundsToKilograms(healthInformation.weight)
                : healthInformation.weight,
          },
          encryptionKey || null,
          profileData.keyPairs.encryptionKeyPair,
        );

      const data: HealthInformationData = {
        healthInformation: encryptedHealthInformation,
        encryptionKey: encryptedHealthInformationEncryptionKey,
      };
      queryClient.setQueryData(healthInformationKeys.details(), data);

      return { previousHealthInformation };
    },
    onError: (_, __, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(healthInformationKeys.details(), context.previousHealthInformation);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: healthInformationKeys.details() });
    },
  });
}
