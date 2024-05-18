import React, { forwardRef } from 'react';

import GorhomBottomSheet from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { CameraIcon, ImageIcon, TrashIcon } from '@components/icons';
import { BottomSheet, BottomSheetLabel, BottomSheetMenuEntry } from '@components/ui';

import i18n from '@translations/i18n';

const SNAP_POINTS = ['30%'];
const ICON_SIZE = 25;

const DeleteLabel = styled(BottomSheetLabel)`
  color: ${({ theme }) => theme.colors.red};
`;

type Props = {
  onOpenPhotoLibrary: () => void;
  onOpenCamera: () => void;
  onDeleteProfilePicture: () => void;
};

const EditProfilePictureBottomSheet = forwardRef<GorhomBottomSheet, Props>(
  ({ onOpenPhotoLibrary, onOpenCamera, onDeleteProfilePicture }, ref) => {
    const theme = useTheme();

    return (
      <BottomSheet ref={ref} index={-1} snapPoints={SNAP_POINTS} enablePanDownToClose>
        <BottomSheetMenuEntry onPress={onOpenPhotoLibrary}>
          <ImageIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
          <BottomSheetLabel>
            {i18n.t('settings.chooseProfilePicture.bottomSheet.photo')}
          </BottomSheetLabel>
        </BottomSheetMenuEntry>
        <BottomSheetMenuEntry onPress={onOpenCamera}>
          <CameraIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
          <BottomSheetLabel>
            {i18n.t('settings.chooseProfilePicture.bottomSheet.camera')}
          </BottomSheetLabel>
        </BottomSheetMenuEntry>
        <BottomSheetMenuEntry onPress={onDeleteProfilePicture}>
          <TrashIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.red} />
          <DeleteLabel>{i18n.t('settings.chooseProfilePicture.bottomSheet.delete')}</DeleteLabel>
        </BottomSheetMenuEntry>
      </BottomSheet>
    );
  },
);

EditProfilePictureBottomSheet.displayName = 'EditProfilePictureBottomSheet';

export default EditProfilePictureBottomSheet;
