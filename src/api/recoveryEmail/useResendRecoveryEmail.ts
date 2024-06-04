import { type UseMutationResult, useMutation } from '@tanstack/react-query';

import { useAuth } from '@auth';

import { API_URL, sendPutRequest } from '@utils/sendRequest';

import recoveryEmailKeys from './recoveryEmailKeys';

export default function useResendRecoveryEmail(): UseMutationResult<
  { message: string },
  unknown,
  void,
  unknown
> {
  const { getAuthToken } = useAuth();

  return useMutation({
    mutationKey: recoveryEmailKeys.resend(),
    mutationFn: () => {
      const authToken = getAuthToken();
      return sendPutRequest<{ message: string }>(
        `${API_URL}/api/account/recovery-email/resend`,
        authToken as string,
      );
    },
  });
}
