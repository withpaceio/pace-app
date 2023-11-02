import React, { type FC, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { CommonActions, useRoute } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';

import useCreateActivity from '@api/activity/useCreateActivity';
import useHealthInformation from '@api/healthInformation/useHealthInformation';
import usePreferences from '@api/preferences/usePreferences';

import { CancelHeaderButton, SaveHeaderButton } from '@components/common/header-buttons';
import ConfirmDiscardActivityModal from '@components/save/ConfirmDiscardActivityModal';
import SaveUI from '@components/save/SaveUI';

import type { ActivityType } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';
import Screens from '@navigation/screens';
import type { SaveScreenProps } from '@navigation/types';
import ActivityTask from '@tasks/ActivityTask';
import i18n from '@translations/i18n';

import { getSummary } from './helpers';

const schema = object().shape({
  name: string().required(i18n.t('saveActivity.form.nameMissing')),
});

type FormData = {
  name: string;
  type: ActivityType;
};

const SaveScreen: FC<SaveScreenProps> = ({ navigation }) => {
  const route = useRoute();
  // @ts-ignore
  const activityType = route?.params?.activityType as ActivityType;

  const activityTask = ActivityTask.getInstance();

  const { data: healthInformationData } = useHealthInformation();
  const { data: preferencesData } = usePreferences();
  const {
    isPending: isCreateActivityLoading,
    isError: isCreateActivityError,
    mutate: createActivity,
    reset: resetCreateActivity,
  } = useCreateActivity();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const defaultName = useMemo(() => {
    const currentHour = new Date().getHours();
    const defaultActivityTypeName = i18n.t(
      `saveActivity.form.activityType.${activityType.toLowerCase()}`,
    );

    if (currentHour < 12) {
      return i18n.t('saveActivity.form.defaultName.morning', {
        activityType: defaultActivityTypeName,
      });
    }
    if (currentHour < 18) {
      return i18n.t('saveActivity.form.defaultName.afternoon', {
        activityType: defaultActivityTypeName,
      });
    }

    return i18n.t('saveActivity.form.defaultName.evening', {
      activityType: defaultActivityTypeName,
    });
  }, [activityType]);

  const { handleSubmit, formState, ...formMethods } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { name: defaultName, type: activityType },
  });

  const goToHomeScreen = useCallback((): void => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: Screens.HOME_NAVIGATOR }] }),
    );
  }, [navigation]);

  const onCancel = useCallback((navigationEvent?: any): void => {
    navigationEvent?.preventDefault();
    setIsConfirmModalOpen(true);
  }, []);

  const onDiscardActivity = useCallback(() => {
    resetCreateActivity();
    setIsConfirmModalOpen(false);

    navigation.removeListener('beforeRemove', onCancel);

    goToHomeScreen();
  }, [goToHomeScreen, navigation, onCancel, resetCreateActivity]);

  const onSubmit = useCallback(
    async ({ name, type }: FormData): Promise<void> => {
      resetCreateActivity();

      const summary = getSummary(name, type, healthInformationData?.healthInformation || null);

      createActivity({
        summary,
        locations: [...activityTask.locations],
        mapSnapshot: activityTask.mapImageLight,
        mapSnapshotDark: activityTask.mapImageDark,
      });

      activityTask.reset();
      navigation.removeListener('beforeRemove', onCancel);
      goToHomeScreen();
    },
    [
      activityTask,
      createActivity,
      goToHomeScreen,
      healthInformationData?.healthInformation,
      navigation,
      onCancel,
      resetCreateActivity,
    ],
  );

  useEffect(() => {
    navigation.addListener('beforeRemove', onCancel);

    return () => {
      navigation.removeListener('beforeRemove', onCancel);
    };
  }, [navigation, onCancel]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <CancelHeaderButton disabled={isCreateActivityLoading} onPress={onCancel} />
      ),
      headerRight: () => (
        <SaveHeaderButton
          disabled={isCreateActivityLoading || !formState.isValid}
          onPress={handleSubmit(onSubmit)}
        />
      ),
    });
  }, [formState.isValid, isCreateActivityLoading, navigation, handleSubmit, onCancel, onSubmit]);

  return (
    <>
      <FormProvider formState={formState} handleSubmit={handleSubmit} {...formMethods}>
        <SaveUI
          distanceMeasurementSystem={
            preferencesData?.measurement || DistanceMeasurementSystem.METRIC
          }
          uploading={isCreateActivityLoading}
          hasError={isCreateActivityError}
          onSubmit={onSubmit}
          onDiscard={goToHomeScreen}
        />
      </FormProvider>
      <ConfirmDiscardActivityModal
        isOpen={isConfirmModalOpen}
        onDiscardActivity={onDiscardActivity}
        onClose={() => setIsConfirmModalOpen(false)}
      />
    </>
  );
};

export default SaveScreen;
