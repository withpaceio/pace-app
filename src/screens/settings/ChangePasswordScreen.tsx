import React, { type FC, useCallback, useLayoutEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { number, object, ref, string } from 'yup';

import { ProfileData, changePassword as changePasswordAuth, useAuth } from '@auth';

import useUpdatePassword from '@api/account/useUpdatePassword';
import useSignIn from '@api/auth/useSignIn';

import { CancelHeaderButton, SaveHeaderButton } from '@components/common/header-buttons';
import ChangePasswordUI from '@components/settings/ChangePasswordUI';
import type { ChangePasswordFormData } from '@components/settings/types';

import Screens from '@navigation/screens';
import type { ChangePasswordScreenProps, SettingsScreenProps } from '@navigation/types';
import i18n from '@translations/i18n';

const schema = object().shape({
  oldPassword: string().required(i18n.t('settings.changePassword.inputs.oldPassword.error')),
  newPassword: string().required(i18n.t('settings.changePassword.inputs.newPassword.error')),
  passwordStrength: number().min(
    4,
    i18n.t('settings.changePassword.inputs.passwordStrength.error'),
  ),
  confirmNewPassword: string()
    .oneOf(
      [ref('newPassword'), null],
      i18n.t('settings.changePassword.inputs.confirmNewPassword.notMatching'),
    )
    .required(i18n.t('settings.changePassword.inputs.confirmNewPassword.error')),
});

const ChangePasswordScreen: FC<ChangePasswordScreenProps> = () => {
  const {
    state: { username, profileData },
  } = useAuth();
  const navigation = useNavigation<SettingsScreenProps['navigation']>();

  const {
    mutateAsync: signIn,
    isError: isSignInError,
    isPending: isSignInPending,
    reset: resetSignIn,
  } = useSignIn();
  const {
    mutate: updatePassword,
    isError,
    isPending,
    reset: resetUpdatePassword,
  } = useUpdatePassword();

  const { handleSubmit, formState, ...formMethods } = useForm<ChangePasswordFormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const goToSettingsScreen = useCallback((): void => {
    navigation.navigate(Screens.SETTINGS);
  }, [navigation]);

  const onDiscard = useCallback((): void => {
    resetSignIn();
    resetUpdatePassword();
    goToSettingsScreen();
  }, [goToSettingsScreen, resetSignIn, resetUpdatePassword]);

  const onSubmitNewPassword = useCallback(
    async ({ oldPassword, newPassword }: ChangePasswordFormData): Promise<void> => {
      resetSignIn();
      resetUpdatePassword();

      try {
        await signIn({ username, password: oldPassword });
        const {
          passwordHashSalt,
          passwordTokenSalt,
          srpSalt,
          srpVerifier,
          profileEncryptionSalt,
          encryptedProfileData,
        } = await changePasswordAuth(username, newPassword, profileData as ProfileData);

        updatePassword({
          passwordHashSalt,
          passwordTokenSalt,
          srpSalt,
          srpVerifier,
          profileEncryptionSalt,
          encryptedProfileData,
        });

        goToSettingsScreen();
      } catch {}
    },
    [
      goToSettingsScreen,
      updatePassword,
      username,
      profileData,
      signIn,
      resetSignIn,
      resetUpdatePassword,
    ],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <CancelHeaderButton
          disabled={formState.isSubmitting || isSignInPending || isPending}
          onPress={goToSettingsScreen}
        />
      ),
      headerRight: () => (
        <SaveHeaderButton
          disabled={formState.isSubmitting || !formState.isValid || isSignInPending || isPending}
          onPress={handleSubmit(onSubmitNewPassword)}
        />
      ),
    });
  }, [
    formState.isSubmitting,
    formState.isValid,
    goToSettingsScreen,
    isSignInPending,
    isPending,
    navigation,
    handleSubmit,
    onSubmitNewPassword,
  ]);

  return (
    <FormProvider formState={formState} handleSubmit={handleSubmit} {...formMethods}>
      <ChangePasswordUI
        saving={formState.isSubmitting || isPending}
        hasFailedAuth={isSignInError}
        hasError={isError}
        onSubmitNewPassword={onSubmitNewPassword}
        onDiscard={onDiscard}
      />
    </FormProvider>
  );
};

export default ChangePasswordScreen;
