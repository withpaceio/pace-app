import React, { type FC } from 'react';

import { useNetInfo } from '@react-native-community/netinfo';
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
  visible: boolean;
  goToPaywall: () => void;
  close: () => void;
};

const ReachedLimitFreePlanModal: FC<Props> = ({ visible, goToPaywall, close }) => {
  const { isInternetReachable } = useNetInfo();
  const isScreenFocused = useIsFocused();

  return (
    <Modal visible={visible && isScreenFocused}>
      <ModalTitle>{i18n.t('recordActivity.reachedLimitModal.title')}</ModalTitle>
      <ModalSubtitle>
        {i18n.t('recordActivity.reachedLimitModal.explanation')}
        {isInternetReachable ? '' : i18n.t('recordActivity.reachedLimitModal.online')}.
      </ModalSubtitle>
      <ModalSeparator />
      {isInternetReachable && (
        <ModalButton onPress={goToPaywall}>
          <ModalGreenButtonLabel>
            {i18n.t('recordActivity.reachedLimitModal.buttons.goToPaywall')}
          </ModalGreenButtonLabel>
        </ModalButton>
      )}
      <ModalSeparator />
      <ModalButton onPress={close}>
        <ModalButtonLabel>
          {i18n.t('recordActivity.reachedLimitModal.buttons.close')}
        </ModalButtonLabel>
      </ModalButton>
    </Modal>
  );
};

export default ReachedLimitFreePlanModal;
