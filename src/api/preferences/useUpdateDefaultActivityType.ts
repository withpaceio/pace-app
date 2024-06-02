import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { encryptDefaultActivityType } from '@activity';
import { useAuth } from '@auth';

import type { PreferencesData } from '@api/preferences/usePreferences';

import type { ActivityType } from '@models/Activity';

import { API_URL, sendPatchRequest } from '@utils/sendRequest';

import preferencesKeys from './preferencesKeys';

type Args = {
  defaultActivityType: ActivityType;
};

export function useMutationFn(): (args: Args) => Promise<{ message: string }> {
  const { getProfileData, getAuthToken } = useAuth();

  return ({ defaultActivityType }: Args) => {
    const profileData = getProfileData();
    if (profileData === null) {
      throw new Error('Profile data is null');
    }

    const encryptedDefaultActivityType = encryptDefaultActivityType(
      defaultActivityType,
      profileData.keyPairs.encryptionKeyPair,
    );

    const authToken = getAuthToken();
    return sendPatchRequest<{ message: string }>(
      `${API_URL}/api/preferences`,
      authToken as string,
      {
        defaultActivityType: encryptedDefaultActivityType,
      },
    );
  };
}

export default function useUpdateDefaultActivityType(): UseMutationResult<
  { message: string },
  unknown,
  Args,
  unknown
> {
  const queryClient = useQueryClient();
  const mutationFn = useMutationFn();
  const { getProfileData } = useAuth();

  return useMutation({
    mutationKey: preferencesKeys.updateDefaultActivityType(),
    mutationFn,
    onMutate: async ({ defaultActivityType }) => {
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
        defaultActivityType: encryptDefaultActivityType(
          defaultActivityType,
          profileData.keyPairs.encryptionKeyPair,
        ),
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
