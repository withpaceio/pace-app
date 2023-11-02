import { type UseMutationResult, useMutation } from '@tanstack/react-query';

import { signUp } from '@auth';

import authKeys from './authKeys';

type Args = { username: string; password: string };

export default function useSignUp(): UseMutationResult<
  Awaited<ReturnType<typeof signUp>>,
  unknown,
  Args,
  unknown
> {
  return useMutation({
    mutationKey: authKeys.signUp(),
    mutationFn: ({ username, password }) => signUp(username, password),
  });
}
