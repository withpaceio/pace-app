import { useMemo } from 'react';

import { QueryCache, QueryClient } from '@tanstack/react-query';

import { useAuth } from '@auth';

export default function useQueryClient(): QueryClient {
  const { openLoggedOutModal } = useAuth();

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: Infinity,
            staleTime: Infinity,
          },
          mutations: {
            gcTime: Infinity,
          },
        },
        queryCache: new QueryCache({
          onError: (error: Error) => {
            if (error.message === '401') {
              openLoggedOutModal();
            }
          },
        }),
      }),
    [openLoggedOutModal],
  );

  return queryClient;
}
