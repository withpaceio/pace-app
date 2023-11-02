import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { signIn, useAuth } from '@auth';

import accountKeys from '@api/account/accountKeys';
import healthInformationKeys from '@api/healthInformation/healthInformationKeys';
import preferencesKeys from '@api/preferences/preferencesKeys';
import profilePictureKeys from '@api/profilePicture/profilePictureKeys';

import authKeys from './authKeys';

type Args = { username: string; password: string };

export default function useSignIn(): UseMutationResult<
  Awaited<ReturnType<typeof signIn>>,
  unknown,
  Args,
  unknown
> {
  const { dispatch, setTokens } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: authKeys.signIn(),
    mutationFn: ({ username, password }) => signIn(username, password),
    onSuccess: async (
      { userId, createdAt, accessToken, refreshToken, profileData },
      { username },
    ) => {
      setTokens(accessToken, refreshToken);
      dispatch({
        type: 'AUTH_SIGN_IN',
        payload: {
          userId,
          username,
          createdAt,
          accessToken,
          refreshToken,
          profileData,
        },
      });

      queryClient.prefetchQuery({ queryKey: accountKeys.details() });
      queryClient.prefetchQuery({ queryKey: healthInformationKeys.details() });
      queryClient.prefetchQuery({ queryKey: preferencesKeys.details() });
      queryClient.prefetchQuery({ queryKey: profilePictureKeys.details() });
    },
  });
}
