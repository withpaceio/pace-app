import React, { type FC, useCallback, useLayoutEffect } from 'react';

import { useNavigation, useRouter } from 'expo-router';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { number, object, string } from 'yup';

import { convertKilogramsToPounds } from '@activity';

import useHealthInformation from '@api/healthInformation/useHealthInformation';
import useUpdateHealthInformation from '@api/healthInformation/useUpdateHealthInformation';
import usePreferences from '@api/preferences/usePreferences';

import { CancelHeaderButton, SaveHeaderButton } from '@components/common/header-buttons';
import ChangeHealthInformationUI from '@components/settings/healthInformation/ChangeHealthInformationUI';

import type { HealthInformation } from '@models/HealthInformation';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import i18n from '@translations/i18n';

const schema = object().shape({
  gender: string()
    .oneOf(
      ['male', 'female', 'non-binary'],
      i18n.t('settings.configureHealthInformation.inputs.gender.invalid'),
    )
    .required(i18n.t('settings.configureHealthInformation.inputs.gender.error')),
  birthDate: string()
    .required(i18n.t('settings.configureHealthInformation.inputs.birthDate.error'))
    .typeError(i18n.t('settings.configureHealthInformation.inputs.birthDate.error')),
  weight: number()
    .min(1, i18n.t('settings.configureHealthInformation.inputs.weight.invalid'))
    .required(i18n.t('settings.configureHealthInformation.inputs.weight.error'))
    .typeError(i18n.t('settings.configureHealthInformation.inputs.weight.invalid')),
});

const ConfigureHealthInformationScreen: FC = () => {
  const {
    mutate: updateHealthInformation,
    isPending,
    isError,
    reset,
  } = useUpdateHealthInformation();
  const { data: preferencesData } = usePreferences();
  const { data: healthInformationData } = useHealthInformation();

  const router = useRouter();
  const navigation = useNavigation();

  const { handleSubmit, formState, ...formMethods } = useForm<HealthInformation>({
    resolver: yupResolver(schema),
    defaultValues: {
      gender: healthInformationData?.healthInformation.gender,
      birthDate: healthInformationData?.healthInformation.birthDate,
      weight:
        preferencesData?.measurement === DistanceMeasurementSystem.IMPERIAL && healthInformationData
          ? Math.round(convertKilogramsToPounds(healthInformationData?.healthInformation.weight))
          : Math.round(healthInformationData?.healthInformation.weight || 0),
    },
  });

  const goToSettingsScreen = useCallback((): void => {
    router.push('/settings');
  }, [router]);

  const onDiscard = useCallback((): void => {
    reset();
    goToSettingsScreen();
  }, [goToSettingsScreen, reset]);

  const onSubmitHealthInformation = useCallback(
    (newHealthInformation: HealthInformation): void => {
      if (!healthInformationData || !preferencesData) {
        return;
      }

      reset();

      updateHealthInformation({
        healthInformation: newHealthInformation,
        encryptionKey: healthInformationData.encryptionKey,
        preferences: preferencesData,
      });

      goToSettingsScreen();
    },
    [goToSettingsScreen, healthInformationData, preferencesData, reset, updateHealthInformation],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelHeaderButton disabled={isPending} onPress={goToSettingsScreen} />,
      headerRight: () => (
        <SaveHeaderButton
          disabled={isPending || !formState.isValid || !formState.isDirty}
          onPress={handleSubmit(onSubmitHealthInformation)}
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
    onSubmitHealthInformation,
  ]);

  return (
    <FormProvider handleSubmit={handleSubmit} formState={formState} {...formMethods}>
      <ChangeHealthInformationUI
        preferences={preferencesData}
        saving={isPending}
        hasError={isError}
        onDiscard={onDiscard}
        onSubmitHealthInformation={onSubmitHealthInformation}
      />
    </FormProvider>
  );
};

export default ConfigureHealthInformationScreen;
