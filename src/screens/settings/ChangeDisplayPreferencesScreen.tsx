import React, { type FC, useCallback, useLayoutEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';

import usePreferences from '@api/preferences/usePreferences';
import useUpdateDisplayPreferences from '@api/preferences/useUpdateDisplayPreferences';

import { CancelHeaderButton, SaveHeaderButton } from '@components/common/header-buttons';
import ChangeDisplayPreferencesUI from '@components/settings/ChangeDisplayPreferencesUI';
import type { ChangeDisplayPreferencesData } from '@components/settings/types';

import { DistanceMeasurementSystem } from '@models/UnitSystem';
import Screens from '@navigation/screens';
import type { ChangeDisplayPreferencesScreenProps, SettingsScreenProps } from '@navigation/types';
import i18n from '@translations/i18n';

const schema = object().shape({
  unit: string()
    .oneOf(
      ['imperial', 'metric'],
      i18n.t('settings.changeDisplayPreferences.inputs.systemOfMeasurement.invalid'),
    )
    .required(i18n.t('settings.changeDisplayPreferences.inputs.systemOfMeasurement.error')),
});

const ChangeDisplayPreferencesScreen: FC<ChangeDisplayPreferencesScreenProps> = () => {
  const navigation = useNavigation<SettingsScreenProps['navigation']>();

  const { data: preferencesData } = usePreferences();
  const { mutate: updatePreferences, isPending, isError, reset } = useUpdateDisplayPreferences();

  const { handleSubmit, formState, ...formMethods } = useForm<ChangeDisplayPreferencesData>({
    resolver: yupResolver(schema),
    defaultValues: {
      unit: preferencesData?.measurement || DistanceMeasurementSystem.METRIC,
    },
  });

  const goToSettingsScreen = useCallback(() => {
    navigation.navigate(Screens.SETTINGS);
  }, [navigation]);

  const onDiscard = useCallback((): void => {
    reset();
    goToSettingsScreen();
  }, [goToSettingsScreen, reset]);

  const onSubmitDisplayPreferences = useCallback(
    ({ unit }: ChangeDisplayPreferencesData): void => {
      reset();

      updatePreferences({ measurement: unit });
      goToSettingsScreen();
    },
    [goToSettingsScreen, reset, updatePreferences],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelHeaderButton disabled={isPending} onPress={goToSettingsScreen} />,
      headerRight: () => (
        <SaveHeaderButton
          disabled={!formState.isValid || !formState.isDirty || isPending}
          onPress={handleSubmit(onSubmitDisplayPreferences)}
        />
      ),
    });
  }, [
    formState.isDirty,
    formState.isValid,
    isPending,
    navigation,
    handleSubmit,
    onSubmitDisplayPreferences,
    goToSettingsScreen,
  ]);

  return (
    <FormProvider formState={formState} handleSubmit={handleSubmit} {...formMethods}>
      <ChangeDisplayPreferencesUI
        isSaving={isPending}
        hasError={isError}
        onSubmit={handleSubmit(onSubmitDisplayPreferences)}
        onDiscard={onDiscard}
      />
    </FormProvider>
  );
};

export default ChangeDisplayPreferencesScreen;
