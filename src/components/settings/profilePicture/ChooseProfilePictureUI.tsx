import React, { type FC, useCallback, useRef } from 'react';
import { Alert, Linking, useWindowDimensions } from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import type GorohmBottomSheet from '@gorhom/bottom-sheet';
import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components/native';

import SavingModal from '@components/common/SavingModal';
import { EditIcon } from '@components/icons';
import { PrimaryButton, Text } from '@components/ui';

import i18n from '@translations/i18n';

import EditProfilePictureBottomSheet from './EditProfilePictureBottomSheet';

const IMAGE_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  base64: true,
};

const Wrapper = styled.SafeAreaView`
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.background};
`;

const ProfilePictureWrapper = styled.View``;

const ActivityIndicatorWrapper = styled.View`
  width: 200px;
  height: 200px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DefaultAvatar = styled(ActivityIndicatorWrapper)`
  border-radius: 100px;
  background-color: rgba(164, 121, 255, 0.25);
  margin-top: ${({ theme }) => 2 * theme.sizes.outerPadding}px;
`;

const Initials = styled(Text)`
  font-size: 150px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.purple};
`;

const ProfilePicture = styled.Image<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  margin-top: ${({ theme }) => 2 * theme.sizes.outerPadding}px;
`;

const EditButtonWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  padding: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const EditButton = styled(PrimaryButton)`
  width: 100%;
`;

type FormData = {
  profilePicture: string | null;
};

type Props = {
  username: string | undefined;
  isUpdating: boolean;
  isUpdatingError: boolean;
  isDeleting: boolean;
  isDeletingError: boolean;
  onSubmit: () => void;
  onDiscard: () => void;
};

const ChooseProfilePictureUI: FC<Props> = ({
  username,
  isUpdating,
  isUpdatingError,
  isDeleting,
  isDeletingError,
  onSubmit,
  onDiscard,
}) => {
  const editProfilePictureBottomSheetRef = useRef<GorohmBottomSheet>(null);

  const { width: windowWidth } = useWindowDimensions();
  const { control, setValue } = useFormContext<FormData>();

  const onOpenEditBottomSheet = useCallback(() => {
    editProfilePictureBottomSheetRef.current?.expand();
  }, []);

  const openAlert = useCallback((title: string, body: string): void => {
    Alert.alert(title, body, [
      { style: 'default', text: i18n.t('settings.chooseProfilePicture.alert.buttons.cancel') },
      {
        style: 'default',
        text: i18n.t('settings.chooseProfilePicture.alert.buttons.openSettings'),
        onPress: Linking.openSettings,
      },
    ]);
  }, []);

  const onOpenMediaLibrary = useCallback(async (): Promise<void> => {
    editProfilePictureBottomSheetRef.current?.close();

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      openAlert(
        i18n.t('settings.chooseProfilePicture.alert.photoPermissions.title'),
        i18n.t('settings.chooseProfilePicture.alert.photoPermissions.body'),
      );

      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync(IMAGE_OPTIONS);
      if (result.canceled || !result.assets[0].base64) {
        return;
      }

      setValue('profilePicture', `data:image/jpeg;base64,${result.assets[0].base64}`, {
        shouldDirty: true,
      });
    } catch {
      Alert.alert(i18n.t('settings.chooseProfilePicture.errors.openPhotosFailure'));
    }
  }, [openAlert, setValue]);

  const onOpenCamera = useCallback(async (): Promise<void> => {
    editProfilePictureBottomSheetRef.current?.close();

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      openAlert(
        i18n.t('settings.chooseProfilePicture.alert.photoPermissions.title'),
        i18n.t('settings.chooseProfilePicture.alert.photoPermissions.body'),
      );

      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync(IMAGE_OPTIONS);
      if (result.canceled || !result.assets[0].base64) {
        return;
      }

      setValue('profilePicture', `data:image/jpeg;base64,${result.assets[0].base64}`);
    } catch {
      Alert.alert(i18n.t('settings.chooseProfilePicture.errors.openCameraFailure'));
    }
  }, [openAlert, setValue]);

  const onDeleteImage = useCallback((): void => {
    editProfilePictureBottomSheetRef.current?.close();
    setValue('profilePicture', null, { shouldDirty: true });
  }, [setValue]);

  return (
    <>
      <Wrapper>
        <Controller
          control={control}
          render={({ field: { value } }) => (
            <ProfilePictureWrapper>
              {value ? (
                <ProfilePicture source={{ uri: value }} size={windowWidth} resizeMode="cover" />
              ) : (
                <DefaultAvatar>
                  <Initials>{username?.substring(0, 1).toUpperCase()}</Initials>
                </DefaultAvatar>
              )}
            </ProfilePictureWrapper>
          )}
          name="profilePicture"
        />
        <EditButtonWrapper>
          <EditButton
            label={i18n.t('settings.chooseProfilePicture.edit')}
            Icon={EditIcon}
            onPress={onOpenEditBottomSheet}
          />
        </EditButtonWrapper>
      </Wrapper>
      <EditProfilePictureBottomSheet
        ref={editProfilePictureBottomSheetRef}
        onOpenPhotoLibrary={onOpenMediaLibrary}
        onOpenCamera={onOpenCamera}
        onDeleteProfilePicture={onDeleteImage}
      />
      <SavingModal
        title={
          isUpdating || isUpdatingError
            ? i18n.t('settings.chooseProfilePicture.updateSavingModal.title')
            : i18n.t('settings.chooseProfilePicture.deleteSavingModal.title')
        }
        errorMessage={
          isUpdatingError
            ? i18n.t('settings.chooseProfilePicture.updateSavingModal.error')
            : i18n.t('settings.chooseProfilePicture.deleteSavingModal.error')
        }
        saving={isUpdating || isDeleting}
        hasError={isUpdatingError || isDeletingError}
        retryLabel={
          isUpdatingError
            ? i18n.t('settings.chooseProfilePicture.updateSavingModal.buttons.retry')
            : i18n.t('settings.chooseProfilePicture.deleteSavingModal.buttons.retry')
        }
        discardLabel={
          isUpdatingError
            ? i18n.t('settings.chooseProfilePicture.updateSavingModal.buttons.discard')
            : i18n.t('settings.chooseProfilePicture.deleteSavingModal.buttons.discard')
        }
        onRetry={onSubmit}
        onDiscard={onDiscard}
      />
    </>
  );
};

export default ChooseProfilePictureUI;
