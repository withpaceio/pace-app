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
  const { getTokens } = useAuth();

  return useMutation({
    mutationKey: recoveryEmailKeys.update(),
    mutationFn: async ({ recoveryEmail }) => {
      const { accessToken } = await getTokens();
      return sendPostRequest<{ message: string }>(
        `${API_URL}/api/account/recovery-email`,
        accessToken,
        { email: recoveryEmail },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: recoveryEmailKeys.details() });
    },
  });
}
