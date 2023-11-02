import React, { type FC, useCallback } from 'react';
import { useLayoutEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';

import usePreferences from '@api/preferences/usePreferences';
import useUpdateDefaultActivityType from '@api/preferences/useUpdateDefaultActivityType';

import { CancelHeaderButton, SaveHeaderButton } from '@components/common/header-buttons';
import ChangeDefaultActivityTypeUI from '@components/settings/ChangeDefaultActivityTypeUI';
import type { ChangeDefaultActivityTypeData } from '@components/settings/types';

import { ActivityType } from '@models/Activity';
import Screens from '@navigation/screens';
import type { SettingsScreenProps } from '@navigation/types';
import i18n from '@translations/i18n';

const schema = object().shape({
  defaultActivityType: string()
    .oneOf(
      ['CYCLING', 'RUNNING'],
      i18n.t('settings.changeDefaultActivityType.inputs.activityType.invalid'),
    )
    .required(i18n.t('settings.changeDefaultActivityType.inputs.activityType.required')),
});

const ChangeDefaultActivityTypeScreen: FC = () => {
  const navigation = useNavigation<SettingsScreenProps['navigation']>();

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
    navigation.navigate(Screens.SETTINGS);
  }, [navigation]);

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
