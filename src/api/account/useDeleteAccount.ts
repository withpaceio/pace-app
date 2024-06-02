import { type UseMutationResult, useMutation } from '@tanstack/react-query';

import { useAuth } from '@auth';

import { API_URL, sendPostRequest } from '@utils/sendRequest';

import accountKeys from './accountKeys';

export default function useDeleteAccount(): UseMutationResult<
  { message: string },
  unknown,
  void | undefined,
  unknown
> {
  const { getAuthToken } = useAuth();

  return useMutation({
    mutationKey: accountKeys.delete(),
    mutationFn: () => {
      const authToken = getAuthToken();
      return sendPostRequest<{ message: string }>(
        `${API_URL}/api/account/delete`,
        authToken as string,
      );
    },
  });
}
