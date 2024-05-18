import React, { type FC } from 'react';

import i18n from '../../translations/i18n';
import AuthLayout from './AuthLayout';
import {
  FormBoldText,
  FormButton,
  FormErrorText,
  FormText,
  Loading,
  SignInForm,
} from './common-components';

type Props = {
  loading: boolean;
  hasError: boolean;
  isSignedIn: boolean;
  onSignIn: (email: string, password: string) => Promise<void>;
  goToAccountSettings: () => void;
  goToHomePage: () => void;
};

const VerifyRecoveryEmailUI: FC<Props> = ({
  loading,
  hasError,
  isSignedIn,
  onSignIn,
  goToAccountSettings,
  goToHomePage,
}) => (
  <AuthLayout>
    {isSignedIn ? (
      <>
        <FormBoldText>{i18n.t('verifyRecoveryEmail.title')}</FormBoldText>
        {loading && <Loading label={i18n.t('verifyRecoveryEmail.loadingLabel')} />}
        {!loading && hasError && (
          <>
            <FormErrorText>{i18n.t('verifyRecoveryEmail.errors.failed')}</FormErrorText>
            <FormButton
              label={i18n.t('verifyRecoveryEmail.buttons.goToAccountSettings')}
              onPress={goToAccountSettings}
            />
          </>
        )}
        {!loading && !hasError && (
          <>
            <FormText>{i18n.t('verifyRecoveryEmail.success')}</FormText>
            <FormButton
              label={i18n.t('verifyRecoveryEmail.buttons.goToHomePage')}
              onPress={goToHomePage}
            />
          </>
        )}
      </>
    ) : (
      <SignInForm loading={loading} hasError={hasError} onSignIn={onSignIn} />
    )}
  </AuthLayout>
);

export default VerifyRecoveryEmailUI;
