import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@auth';

import { API_URL, sendPostRequest } from '@utils/sendRequest';

import profilePictureKeys from './profilePictureKeys';

type Args = void | object;

export function useMutationFn(): () => Promise<{ message: string }> {
  const { getTokens } = useAuth();

  return async () => {
    const { accessToken } = await getTokens();

    return sendPostRequest<{ message: string }>(
      `${API_URL}/api/account/profile-picture/delete`,
      accessToken,
    );
  };
}

export default function useDeleteAccount(): UseMutationResult<
  { message: string },
  unknown,
  Args,
  unknown
> {
  const queryClient = useQueryClient();
  const mutationFn = useMutationFn();

  return useMutation({
    mutationKey: profilePictureKeys.delete(),
    mutationFn,
    onMutate: async () => {
      queryClient.cancelQueries({ queryKey: profilePictureKeys.details() });
      const previousProfilePicture = queryClient.getQueryData<string>([
        'account',
        'profilePicture',
      ]);

      queryClient.setQueryData(profilePictureKeys.details(), null);

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
