import React, { type FC, useCallback, useEffect, useState } from 'react';

import useIsUsernameAvailable from '@api/auth/useIsUsernameAvailable';
import useSignIn from '@api/auth/useSignIn';
import useSignUp from '@api/auth/useSignUp';

import SigningProgressModal from '@components/auth/SigningProgressModal';
import SignUpUI from '@components/auth/SignUpUI';

import i18n from '@translations/i18n';

type Props = {
  onLoadingChanged: (loading: boolean) => void;
};

const SignUpScreen: FC<Props> = ({ onLoadingChanged }) => {
  const [usernameToCheck, setUsernameToCheck] = useState<string>();

  const {
    data,
    fetchStatus: usernameFetchStatus,
    isLoading: isUsernameLoading,
  } = useIsUsernameAvailable(usernameToCheck);
  const { mutate: signIn, isPending: isSignInLoading, isError: isSignInError } = useSignIn();
  const { mutate: signUp, isPending: isSignUpLoading, isError: isSignUpError } = useSignUp();

  const checkUsernameAvailability = useCallback(async (newUsername: string): Promise<void> => {
    setUsernameToCheck(newUsername);
  }, []);

  const onSignUp = useCallback(
    (username: string, password: string): void => {
      signUp(
        { username, password },
        {
          onSuccess: () => {
            signIn({ username, password });
          },
        },
      );
    },
    [signIn, signUp],
  );

  useEffect(() => {
    onLoadingChanged(isSignInLoading || isSignUpLoading);
  }, [isSignInLoading, isSignUpLoading, onLoadingChanged]);

  return (
    <>
      <SignUpUI
        usernameAvailable={(data && data.isAvailable) || (!data && usernameFetchStatus === 'idle')}
        loadingUsernameAvailability={isUsernameLoading && usernameFetchStatus === 'fetching'}
        loading={isSignInLoading || isSignUpLoading}
        hasError={isSignInError || isSignUpError}
        onCheckUsernameAvailability={checkUsernameAvailability}
        onSignUp={onSignUp}
      />
      <SigningProgressModal
        title={i18n.t('signUp.loadingLabel')}
        visible={isSignInLoading || isSignUpLoading}
      />
    </>
  );
};

export default SignUpScreen;
