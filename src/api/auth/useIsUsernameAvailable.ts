import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { API_URL, sendPostRequest } from '@utils/sendRequest';

import authKeys from './authKeys';

export default function useIsUsernameAvailable(
  username: string | undefined,
): UseQueryResult<{ isAvailable: boolean }, Error> {
  return useQuery({
    queryKey: authKeys.usernameAvailable(username),
    queryFn: () =>
      sendPostRequest<{ isAvailable: boolean }>(`${API_URL}/api/auth/check-username`, undefined, {
        username,
      }),
    enabled: !!username,
    gcTime: 0,
    staleTime: 0,
  });
}
