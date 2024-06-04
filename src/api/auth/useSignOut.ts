import { type UseMutationResult, useMutation } from '@tanstack/react-query';

import { useAuth } from '@auth';

import { API_URL, sendPostRequest } from '@utils/sendRequest';

import authKeys from './authKeys';

export default function useSignOut(): UseMutationResult<
  { message: string },
  unknown,
  void,
  unknown
> {
  const { getAuthToken, signOut } = useAuth();

  return useMutation({
    mutationKey: authKeys.signOut(),
    mutationFn: () => {
      const authToken = getAuthToken();
      return sendPostRequest<{ message: string }>(
        `${API_URL}/api/auth/signout`,
        authToken as string,
      );
    },
    onSettled: () => {
      signOut();
    },
  });
}
