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
  const { getTokens, signOut } = useAuth();

  return useMutation({
    mutationKey: authKeys.signOut(),
    mutationFn: async () => {
      const { accessToken, refreshToken } = await getTokens();
      return sendPostRequest<{ message: string }>(`${API_URL}/api/auth/signout`, accessToken, {
        refreshToken,
      });
    },
    onSettled: () => {
      signOut();
    },
  });
}
