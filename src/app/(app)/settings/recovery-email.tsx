import React, { type FC, useCallback, useLayoutEffect } from 'react';

import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';

import useUpdateRecoveryEmail from '@api/recoveryEmail/useUpdateRecoveryEmail';

import { CancelHeaderButton, SaveHeaderButton } from '@components/common/header-buttons';
import ConfigureRecoveryEmailUI from '@components/settings/ConfigureRecoveryEmailUI';

import i18n from '@translations/i18n';

type FormType = {
  email: string;
};

const schema = object().shape({
  email: string()
    .email(i18n.t('account.errors.email.invalid'))
    .required(i18n.t('account.errors.email.missing')),
});

const ConfigureRecoveryEmailScreen: FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { recoveryEmail } = useLocalSearchParams<{ recoveryEmail: string }>();

  const { mutate: updateRecoveryEmail, isError, isPending, reset } = useUpdateRecoveryEmail();

  const { handleSubmit, formState, ...formMethods } = useForm<FormType>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      email: recoveryEmail ?? '',
    },
  });

  const onSave = useCallback(
    (data: FormType): void => {
      reset();

      updateRecoveryEmail(
        { recoveryEmail: data.email },
        {
          onSuccess: () => {
            router.back();
          },
        },
      );
    },
    [reset, router, updateRecoveryEmail],
  );

  const goToSettingsScreen = useCallback((): void => {
    router.back();
  }, [router]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelHeaderButton disabled={isPending} onPress={goToSettingsScreen} />,
      headerRight: () => (
        <SaveHeaderButton
          disabled={!formState.isValid || !formState.isDirty || isPending}
          onPress={handleSubmit(onSave)}
        />
      ),
    });
  }, [
    formState.isDirty,
    formState.isValid,
    isPending,
    navigation,
    goToSettingsScreen,
    handleSubmit,
    onSave,
  ]);

  return (
    <FormProvider formState={formState} handleSubmit={handleSubmit} {...formMethods}>
      <ConfigureRecoveryEmailUI saving={isPending} hasError={isError} onSave={onSave} />
    </FormProvider>
  );
};

export default ConfigureRecoveryEmailScreen;
