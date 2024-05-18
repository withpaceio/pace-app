import React, { type FC, useCallback } from 'react';
import { useLayoutEffect } from 'react';

import { useNavigation, useRouter } from 'expo-router';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';

import usePreferences from '@api/preferences/usePreferences';
import useUpdateDefaultActivityType from '@api/preferences/useUpdateDefaultActivityType';

import { CancelHeaderButton, SaveHeaderButton } from '@components/common/header-buttons';
import ChangeDefaultActivityTypeUI from '@components/settings/ChangeDefaultActivityTypeUI';
import type { ChangeDefaultActivityTypeData } from '@components/settings/types';

import { ActivityType } from '@models/Activity';

import i18n from '@translations/i18n';

const schema = object().shape({
  defaultActivityType: string()
    .oneOf(
      [ActivityType.CYCLING, ActivityType.RUNNING],
      i18n.t('settings.changeDefaultActivityType.inputs.activityType.invalid'),
    )
    .required(i18n.t('settings.changeDefaultActivityType.inputs.activityType.required')),
});

const ChangeDefaultActivityTypeScreen: FC = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const { data: preferencesData } = usePreferences();
  const {
    mutate: updateDefaultActivityType,
    isError,
    isPending,
    reset,
  } = useUpdateDefaultActivityType();

  const { handleSubmit, formState, ...formMethods } = useForm<ChangeDefaultActivityTypeData>({
    resolver: yupResolver(schema),
    defaultValues: {
      defaultActivityType: preferencesData?.defaultActivityType || ActivityType.RUNNING,
    },
  });

  const goToSettingsScreen = useCallback((): void => {
    router.push('/settings');
  }, [router]);

  const onDiscard = useCallback((): void => {
    reset();
    goToSettingsScreen();
  }, [goToSettingsScreen, reset]);

  const onSubmitDefaultActivityType = useCallback(
    ({ defaultActivityType }: ChangeDefaultActivityTypeData): void => {
      reset();
      updateDefaultActivityType({ defaultActivityType });
      goToSettingsScreen();
    },
    [goToSettingsScreen, reset, updateDefaultActivityType],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelHeaderButton disabled={isPending} onPress={goToSettingsScreen} />,
      headerRight: () => (
        <SaveHeaderButton
          disabled={!formState.isValid || !formState.isDirty || isPending}
          onPress={handleSubmit(onSubmitDefaultActivityType)}
        />
      ),
    });
  }, [
    formState.isDirty,
    formState.isValid,
    goToSettingsScreen,
    isPending,
    handleSubmit,
    navigation,
    onSubmitDefaultActivityType,
  ]);

  return (
    <FormProvider formState={formState} handleSubmit={handleSubmit} {...formMethods}>
      <ChangeDefaultActivityTypeUI
        isLoading={isPending}
        hasError={isError}
        onSubmit={handleSubmit(onSubmitDefaultActivityType)}
        onDiscard={onDiscard}
      />
    </FormProvider>
  );
};

export default ChangeDefaultActivityTypeScreen;
