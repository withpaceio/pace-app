import { type UseMutationResult, useMutation } from '@tanstack/react-query';

import { useAuth } from '@auth';

import { API_URL, sendDeleteRequest } from '@utils/sendRequest';

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
      return sendDeleteRequest<{ message: string }>(`${API_URL}/api/account`, authToken as string);
    },
  });
}
