import React, { type FC, useCallback, useLayoutEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';

import useAccount from '@api/account/useAccount';
import useDeleteProfilePicture from '@api/profilePicture/useDeleteProfilePicture';
import useProfilePicture from '@api/profilePicture/useProfilePicture';
import useUpdateProfilePicture from '@api/profilePicture/useUpdateProfilePicture';

import { CancelHeaderButton, SaveHeaderButton } from '@components/common/header-buttons';
import ChooseProfilePictureUI from '@components/settings/profilePicture/ChooseProfilePictureUI';

import Screens from '@navigation/screens';
import type { AccountScreenProps, ChoosePictureScreenProps } from '@navigation/types';

type FormType = {
  profilePicture: string | null;
};

const schema = object().shape({
  profilePicture: string().nullable().notRequired(),
});

const ChooseProfilePictureScreen: FC<ChoosePictureScreenProps> = () => {
  const navigation = useNavigation<AccountScreenProps['navigation']>();

  const { data: accountData } = useAccount();
  const { data: profilePictureData } = useProfilePicture();
  const {
    mutate: deleteProfilePicture,
    isPending: isDeletingProfilePicture,
    isError: isDeleteProfilePictureError,
    reset: resetDeleteProfilePicture,
  } = useDeleteProfilePicture();
  const {
    mutate: updateProfilePicture,
    isPending: isUpdatingProfilePicture,
    isError: isUpdateProfilePictureError,
    reset: resetUpdateProfilePicture,
  } = useUpdateProfilePicture();

  const { handleSubmit, formState, ...formMethods } = useForm<FormType>({
    resolver: yupResolver(schema),
    defaultValues: {
      profilePicture: profilePictureData,
    },
  });

  const goToAccountScreen = useCallback((): void => {
    navigation.navigate(Screens.ACCOUNT);
  }, [navigation]);

  const onDeleteProfilePicture = useCallback((): void => {
    resetDeleteProfilePicture();
    deleteProfilePicture();
    goToAccountScreen();
  }, [deleteProfilePicture, goToAccountScreen, resetDeleteProfilePicture]);

  const onSave = useCallback(
    ({ profilePicture }: FormType): void => {
      if (!profilePicture) {
        onDeleteProfilePicture();
        return;
      }

      resetUpdateProfilePicture();
      updateProfilePicture({ profilePicture });
      goToAccountScreen();
    },
    [goToAccountScreen, onDeleteProfilePicture, resetUpdateProfilePicture, updateProfilePicture],
  );

  const onDiscard = useCallback((): void => {
    resetUpdateProfilePicture();
    resetDeleteProfilePicture();
    goToAccountScreen();
  }, [goToAccountScreen, resetDeleteProfilePicture, resetUpdateProfilePicture]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <CancelHeaderButton
          onPress={goToAccountScreen}
          disabled={isUpdatingProfilePicture || isDeletingProfilePicture}
        />
      ),
      headerRight: () => (
        <SaveHeaderButton
          disabled={!formState.isDirty || isUpdatingProfilePicture || isDeletingProfilePicture}
          onPress={handleSubmit(onSave)}
        />
      ),
    });
  }, [
    formState.isDirty,
    goToAccountScreen,
    isDeletingProfilePicture,
    isUpdatingProfilePicture,
    handleSubmit,
    navigation,
    onSave,
  ]);

  return (
    <FormProvider formState={formState} handleSubmit={handleSubmit} {...formMethods}>
      <ChooseProfilePictureUI
        username={accountData?.username}
        isUpdating={isUpdatingProfilePicture}
        isUpdatingError={isUpdateProfilePictureError}
        isDeleting={isDeletingProfilePicture}
        isDeletingError={isDeleteProfilePictureError}
        onSubmit={handleSubmit(onSave)}
        onDiscard={onDiscard}
      />
    </FormProvider>
  );
};

export default ChooseProfilePictureScreen;
