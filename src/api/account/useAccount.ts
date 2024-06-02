import { useCallback } from 'react';

import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { useAuth } from '@auth';

import type { Account } from '@models/Account';

import { API_URL, sendGetRequest } from '@utils/sendRequest';

import accountKeys from './accountKeys';

type AccountData = Omit<Account, 'createdAt'> & { createdAt: string };

export function useQueryFn(): () => Promise<AccountData> {
  const { getAuthToken } = useAuth();

  return () => {
    const authToken = getAuthToken();
    return sendGetRequest<AccountData>(`${API_URL}/api/account`, authToken as string);
  };
}

export default function useAccount(): UseQueryResult<Account, Error> {
  const { getAuthToken } = useAuth();
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
    enabled: Boolean(getAuthToken()),
  });
}
