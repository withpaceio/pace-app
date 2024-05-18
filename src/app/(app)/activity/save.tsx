import React, { type FC, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';

import { buildSummary } from '@activity';

import useCreateActivity from '@api/activity/useCreateActivity';
import useHealthInformation from '@api/healthInformation/useHealthInformation';
import usePreferences from '@api/preferences/usePreferences';

import { CancelHeaderButton, SaveHeaderButton } from '@components/common/header-buttons';
import ConfirmDiscardActivityModal from '@components/save/ConfirmDiscardActivityModal';
import SaveUI from '@components/save/SaveUI';

import { ActivityType } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import ActivityTask from '@tasks/ActivityTask';

import i18n from '@translations/i18n';

const schema = object().shape({
  name: string().required(i18n.t('saveActivity.form.nameMissing')),
  type: string()
    .oneOf([ActivityType.CYCLING, ActivityType.RUNNING])
    .required(i18n.t('saveAcrtivity.form.activityTypeMissing')),
});

type FormData = {
  name: string;
  type: ActivityType;
};

const SaveScreen: FC = () => {
  const activityTask = ActivityTask.getInstance();

  const router = useRouter();
  const navigation = useNavigation();
  const { activityType } = useLocalSearchParams<{ activityType: ActivityType }>();

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
      `saveActivity.form.activityType.${(activityType || ActivityType.RUNNING).toLowerCase()}`,
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
    router.push('/');
  }, [router]);

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

      const summary = buildSummary(
        name,
        type,
        activityTask.startTimestamp,
        activityTask.endTimestamp,
        activityTask.distance,
        healthInformationData?.healthInformation || null,
      );

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
