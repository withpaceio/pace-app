import React, { type FC, useEffect } from 'react';

import useSignIn from '@api/auth/useSignIn';

import SigningProgressModal from '@components/auth/SigningProgressModal';
import SignInUI from '@components/auth/SignInUI';

import i18n from '@translations/i18n';

type Props = {
  onLoadingChanged: (loading: boolean) => void;
};

const SignInScreen: FC<Props> = ({ onLoadingChanged }) => {
  const { mutate: signIn, isPending, isError } = useSignIn();

  const onSignIn = (username: string, password: string): void => {
    signIn({ username, password });
  };

  useEffect(() => {
    onLoadingChanged(isPending);
  }, [isPending, onLoadingChanged]);

  return (
    <>
      <SignInUI loading={isPending} hasError={isError} onSignIn={onSignIn} />
      <SigningProgressModal title={i18n.t('signIn.loadingLabel')} visible={isPending} />
    </>
  );
};

export default SignInScreen;
