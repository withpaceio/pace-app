import React, { type FC, useCallback, useLayoutEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';

import { updateSummary } from '@activity';

import useActivity from '@api/activity/useActivity';
import useUpdateActivity from '@api/activity/useUpdateActivity';
import useHealthInformation from '@api/healthInformation/useHealthInformation';

import { CancelHeaderButton, SaveHeaderButton } from '@components/common/header-buttons';
import SavingModal from '@components/common/SavingModal';
import EditActivityUI from '@components/editActivity/EditActivityUI';

import type { ActivitySummary, ActivityType } from '@models/Activity';
import type { EditActivityScreenProps } from '@navigation/types';
import i18n from '@translations/i18n';

const schema = object().shape({
  name: string().required(i18n.t('editActivity.form.nameMissing')),
});

type FormData = {
  name: string;
  type: ActivityType;
};

const EditActivityScreen: FC<EditActivityScreenProps> = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { id: activityId } = useLocalSearchParams<{ id?: string }>();

  const { handleSubmit, formState, ...formMethods } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { data: healthInformationData } = useHealthInformation();
  const { data: activity } = useActivity(activityId);
  const { mutate: updateActivity, isError, isPending, reset } = useUpdateActivity();

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

      router.push(`/activity/${activityId}`);
    },
    [activity, activityId, healthInformationData?.healthInformation, reset, router, updateActivity],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelHeaderButton onPress={router.back} disabled={isPending} />,
      headerRight: () => (
        <SaveHeaderButton
          onPress={handleSubmit(onSubmit)}
          disabled={isPending || !formState.isDirty}
        />
      ),
    });
  }, [formState.isDirty, isPending, handleSubmit, navigation, onSubmit, router]);

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