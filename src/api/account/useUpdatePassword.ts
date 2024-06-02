import { type UseMutationResult, useMutation } from '@tanstack/react-query';

import { useAuth } from '@auth';

import { API_URL, sendPostRequest } from '@utils/sendRequest';

import accountKeys from './accountKeys';

export default function useUpdatePassword(): UseMutationResult<
  { message: string },
  unknown,
  {
    passwordHashSalt: string;
    passwordTokenSalt: string;
    srpSalt: string;
    srpVerifier: string;
    profileEncryptionSalt: string;
    encryptedProfileData: string;
  },
  unknown
> {
  const { getAuthToken } = useAuth();

  return useMutation({
    mutationKey: accountKeys.updatePassword(),
    mutationFn: (data) => {
      const authToken = getAuthToken();
      return sendPostRequest<{ message: string }>(
        `${API_URL}/api/account/change-password`,
        authToken as string,
        data,
      );
    },
  });
}
