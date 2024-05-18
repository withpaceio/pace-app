import React, { type FC, useCallback } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import { TextInput } from '@components/ui';

import { SignInSchema } from '@models/SignIn';

import i18n from '@translations/i18n';

import FormButton from './FormButton';
import FormErrorText from './FormErrorText';
import PasswordInput from './PasswordInput';

type FormData = {
  username: string;
  password: string;
};

type Props = {
  loading: boolean;
  hasError: boolean;
  onSignIn: (username: string, password: string) => void;
};

const SignInForm: FC<Props> = ({ loading, hasError, onSignIn }) => {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(SignInSchema),
  });

  const onSubmit = useCallback(
    ({ username, password }: FormData): void => {
      onSignIn(username, password);
    },
    [onSignIn],
  );

  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextInput
            placeholder={i18n.t('signIn.usernamePlaceholder')}
            value={value}
            editable={!loading}
            caption={error?.message}
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
        name="username"
        rules={{ required: true }}
        defaultValue=""
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <PasswordInput
            placeholder={i18n.t('signIn.passwordPlaceholder')}
            value={value}
            editable={!loading}
            autoComplete="password"
            caption={error?.message}
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={handleSubmit(onSubmit)}
            secureTextEntry
          />
        )}
        name="password"
        rules={{ required: true }}
        defaultValue=""
      />
      <FormButton
        label={i18n.t('signIn.buttons.signIn')}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      />
      {hasError && <FormErrorText>{i18n.t('signIn.errors.failed')}</FormErrorText>}
    </>
  );
};

export default SignInForm;
