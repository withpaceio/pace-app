import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { useAuth } from '@auth';

import type { RecoveryEmail } from '@models/RecoveryEmail';

import { API_URL, sendGetRequest } from '@utils/sendRequest';

import recoveryEmailKeys from './recoveryEmailKeys';

export default function useRecoveryEmail(): UseQueryResult<RecoveryEmail, Error> {
  const { getTokens, isRefreshingTokens } = useAuth();

  return useQuery({
    queryKey: recoveryEmailKeys.details(),
    queryFn: async () => {
      const { accessToken } = await getTokens();
      return sendGetRequest<RecoveryEmail>(`${API_URL}/api/account/recovery-email`, accessToken);
    },
    enabled: !isRefreshingTokens(),
  });
}
