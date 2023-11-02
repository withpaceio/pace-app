import React, { type FC } from 'react';

import {
  Modal,
  ModalButton,
  ModalGreenButtonLabel,
  ModalSeparator,
  ModalTitle,
} from '@components/ui';

import i18n from '@translations/i18n';

type Props = {
  visible: boolean;
  goToSettings: () => void;
};

const PurchasingSuccessModal: FC<Props> = ({ visible, goToSettings }) => (
  <Modal visible={visible}>
    <ModalTitle>{i18n.t('paywall.purchasingSuccessModal.thankYou')}</ModalTitle>
    <ModalSeparator />
    <ModalButton onPress={goToSettings}>
      <ModalGreenButtonLabel>
        {i18n.t('paywall.purchasingSuccessModal.goToSettings')}
      </ModalGreenButtonLabel>
    </ModalButton>
  </Modal>
);

export default PurchasingSuccessModal;
