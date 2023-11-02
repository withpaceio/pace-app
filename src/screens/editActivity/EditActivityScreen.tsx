import React, { type FC, useCallback, useLayoutEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useRoute } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';

import useActivity from '@api/activity/useActivity';
import useUpdateActivity from '@api/activity/useUpdateActivity';
import useHealthInformation from '@api/healthInformation/useHealthInformation';

import { CancelHeaderButton, SaveHeaderButton } from '@components/common/header-buttons';
import SavingModal from '@components/common/SavingModal';
import EditActivityUI from '@components/editActivity/EditActivityUI';

import type { ActivitySummary, ActivityType } from '@models/Activity';
import Screens from '@navigation/screens';
import type { EditActivityScreenProps } from '@navigation/types';
import i18n from '@translations/i18n';

import { updateSummary } from './helpers';

const schema = object().shape({
  name: string().required(i18n.t('editActivity.form.nameMissing')),
});

type FormData = {
  name: string;
  type: ActivityType;
};

const EditActivityScreen: FC<EditActivityScreenProps> = ({ navigation }) => {
  const route = useRoute();
  // @ts-ignore
  const activityId = route.params?.activityId;

  const { handleSubmit, formState, ...formMethods } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { data: healthInformationData } = useHealthInformation();
  const { data: activity } = useActivity(activityId);
  const { mutate: updateActivity, isError, isPending, reset } = useUpdateActivity();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onDiscard = useCallback((): void => {
    reset();
  }, [reset]);

  const onSubmit = useCallback(
    ({ name, type }: FormData): void => {
      if (!activity) {
        return;
      }

      reset();

      const updatedSummary = updateSummary(
        name,
        type,
        activity.summary as ActivitySummary,
        healthInformationData?.healthInformation!,
      );

      updateActivity({
        activityId,
        summary: updatedSummary,
        activityEncryptionKey: activity.encryptionKey,
      });

      navigation.navigate(Screens.ACTIVITY_DETAILS, { activityId });
    },
    [
      activity,
      activityId,
      healthInformationData?.healthInformation,
      navigation,
      reset,
      updateActivity,
    ],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelHeaderButton onPress={goBack} disabled={isPending} />,
      headerRight: () => (
        <SaveHeaderButton
          onPress={handleSubmit(onSubmit)}
          disabled={isPending || !formState.isDirty}
        />
      ),
    });
  }, [formState.isDirty, isPending, goBack, handleSubmit, navigation, onSubmit]);

  return (
    <>
      <FormProvider formState={formState} handleSubmit={handleSubmit} {...formMethods}>
        <EditActivityUI activity={activity} onSubmit={onSubmit} />
      </FormProvider>
      <SavingModal
        title={i18n.t('editActivity.savingModal.title')}
        errorMessage={i18n.t('editActivity.savingModal.errorBody')}
        saving={isPending}
        hasError={isError}
        retryLabel={i18n.t('editActivity.savingModal.buttons.retry')}
        discardLabel={i18n.t('editActivity.savingModal.buttons.cancel')}
        onRetry={handleSubmit(onSubmit)}
        onDiscard={onDiscard}
      />
    </>
  );
};

export default EditActivityScreen;
