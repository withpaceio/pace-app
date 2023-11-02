import { useCallback } from 'react';

import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { useAuth } from '@auth';

import type { Account } from '@models/Account';
import { API_URL, sendGetRequest } from '@utils/sendRequest';

import accountKeys from './accountKeys';

type AccountData = Omit<Account, 'createdAt'> & { createdAt: string };

export function useQueryFn(): () => Promise<AccountData> {
  const { getTokens } = useAuth();

  return async () => {
    const { accessToken } = await getTokens();
    return sendGetRequest<AccountData>(`${API_URL}/api/account`, accessToken);
  };
}

export default function useAccount(): UseQueryResult<Account, Error> {
  const { isRefreshingTokens } = useAuth();
  const queryFn = useQueryFn();

  return useQuery({
    queryKey: accountKeys.details(),
    queryFn,
    select: useCallback(
      (accountData: AccountData): Account => ({
        ...accountData,
        createdAt: new Date(accountData.createdAt),
      }),
      [],
    ),
    enabled: !isRefreshingTokens(),
  });
}
