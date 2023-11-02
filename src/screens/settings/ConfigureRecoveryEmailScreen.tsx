import React, { type FC, useCallback, useLayoutEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';

import useUpdateRecoveryEmail from '@api/recoveryEmail/useUpdateRecoveryEmail';

import { CancelHeaderButton, SaveHeaderButton } from '@components/common/header-buttons';
import ConfigureRecoveryEmailUI from '@components/settings/ConfigureRecoveryEmailUI';

import Screens from '@navigation/screens';
import type { ConfigureRecoveryEmailScreenProps, HomeTabsScreenProps } from '@navigation/types';
import i18n from '@translations/i18n';

type FormType = {
  email: string;
};

const schema = object().shape({
  email: string()
    .email(i18n.t('account.errors.email.invalid'))
    .required(i18n.t('account.errors.email.missing')),
});

const ConfigureRecoveryEmailScreen: FC<ConfigureRecoveryEmailScreenProps> = () => {
  const navigation = useNavigation<HomeTabsScreenProps['navigation']>();
  const route = useRoute();

  const { mutate: updateRecoveryEmail, isError, isPending, reset } = useUpdateRecoveryEmail();

  const { handleSubmit, formState, ...formMethods } = useForm<FormType>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      // @ts-expect-error
      email: route?.params?.recoveryEmail ?? '',
    },
  });

  const onSave = useCallback(
    (data: FormType): void => {
      reset();

      updateRecoveryEmail(
        { recoveryEmail: data.email },
        {
          onSuccess: () => {
            navigation.navigate(Screens.SETTINGS);
          },
        },
      );
    },
    [navigation, reset, updateRecoveryEmail],
  );

  const onCancel = useCallback((): void => {
    navigation.navigate(Screens.SETTINGS);
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelHeaderButton disabled={isPending} onPress={onCancel} />,
      headerRight: () => (
        <SaveHeaderButton
          disabled={!formState.isValid || !formState.isDirty || isPending}
          onPress={handleSubmit(onSave)}
        />
      ),
    });
  }, [formState.isDirty, formState.isValid, isPending, navigation, onCancel, handleSubmit, onSave]);

  return (
    <FormProvider formState={formState} handleSubmit={handleSubmit} {...formMethods}>
      <ConfigureRecoveryEmailUI saving={isPending} hasError={isError} onSave={onSave} />
    </FormProvider>
  );
};

export default ConfigureRecoveryEmailScreen;
