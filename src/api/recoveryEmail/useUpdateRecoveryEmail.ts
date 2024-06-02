import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@auth';

import { API_URL, sendPostRequest } from '@utils/sendRequest';

import recoveryEmailKeys from './recoveryEmailKeys';

export default function useUpdateRecoveryEmail(): UseMutationResult<
  { message: string },
  unknown,
  { recoveryEmail: string },
  unknown
> {
  const queryClient = useQueryClient();
  const { getAuthToken } = useAuth();

  return useMutation({
    mutationKey: recoveryEmailKeys.update(),
    mutationFn: ({ recoveryEmail }) => {
      const authToken = getAuthToken();
      return sendPostRequest<{ message: string }>(
        `${API_URL}/api/account/recovery-email`,
        authToken as string,
        { email: recoveryEmail },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: recoveryEmailKeys.details() });
    },
  });
}
