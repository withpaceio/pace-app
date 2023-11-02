import React, { FC } from 'react';

import {
  Modal,
  ModalButton,
  ModalButtonLabel,
  ModalRedButtonLabel,
  ModalSeparator,
  ModalSubtitle,
  ModalTitle,
} from '@components/ui';

import i18n from '@translations/i18n';

type Props = {
  isOpen: boolean;
  onDiscardActivity: () => void;
  onClose: () => void;
};

const ConfirmDiscardActivityModal: FC<Props> = ({ isOpen, onDiscardActivity, onClose }) => (
  <Modal visible={isOpen}>
    <ModalTitle>{i18n.t('saveActivity.discardModal.title')}</ModalTitle>
    <ModalSubtitle>{i18n.t('saveActivity.discardModal.body')}</ModalSubtitle>
    <ModalSeparator />
    <ModalButton onPress={onDiscardActivity}>
      <ModalRedButtonLabel>
        {i18n.t('saveActivity.discardModal.buttons.discard')}
      </ModalRedButtonLabel>
    </ModalButton>
    <ModalSeparator />
    <ModalButton onPress={onClose}>
      <ModalButtonLabel>{i18n.t('saveActivity.discardModal.buttons.stayHere')}</ModalButtonLabel>
    </ModalButton>
  </Modal>
);

export default ConfirmDiscardActivityModal;
