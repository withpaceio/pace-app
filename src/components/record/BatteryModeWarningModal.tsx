import React, { type FC } from 'react';
import { Linking } from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import {
  Modal,
  ModalButton,
  ModalButtonLabel,
  ModalGreenButtonLabel,
  ModalSeparator,
  ModalSubtitle,
  ModalTitle,
} from '@components/ui';

import i18n from '@translations/i18n';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const BatteryModeWarningModal: FC<Props> = ({ isOpen, onClose }) => {
  const isScreenFocused = useIsFocused();

  return (
    <Modal visible={isOpen && isScreenFocused}>
      <ModalTitle>{i18n.t('recordActivity.batteryWarning.lowPowerMode.title')}</ModalTitle>
      <ModalSubtitle>{i18n.t('recordActivity.batteryWarning.lowPowerMode.message')}</ModalSubtitle>
      <ModalSeparator />
      <ModalButton onPress={() => Linking.openSettings()}>
        <ModalGreenButtonLabel>
          {i18n.t('recordActivity.buttons.openSettings')}
        </ModalGreenButtonLabel>
      </ModalButton>
      <ModalSeparator />
      <ModalButton onPress={onClose}>
        <ModalButtonLabel>{i18n.t('recordActivity.buttons.cancel')}</ModalButtonLabel>
      </ModalButton>
    </Modal>
  );
};

export default BatteryModeWarningModal;
