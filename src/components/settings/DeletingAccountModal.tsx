import React, { type FC } from 'react';

import styled from 'styled-components/native';

import {
  ActivityIndicator,
  Modal,
  ModalButton,
  ModalButtonLabel,
  ModalSeparator,
  ModalSubtitle,
  ModalTitle,
} from '@components/ui';

import i18n from '@translations/i18n';

const ActivityIndicatorWrapper = styled.View`
  margin: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = {
  visible: boolean;
  hasError: boolean;
  onClose: () => void;
};

const DeletingAccountModal: FC<Props> = ({ visible, hasError, onClose }) => (
  <Modal visible={visible}>
    {hasError ? (
      <>
        <ModalTitle>{i18n.t('settings.deleteAccount.deletingModal.hasError.title')}</ModalTitle>
        <ModalSubtitle>
          {i18n.t('settings.deleteAccount.deletingModal.hasError.explanation')}
        </ModalSubtitle>
        <ModalSeparator />
        <ModalButton onPress={onClose}>
          <ModalButtonLabel>
            {i18n.t('settings.deleteAccount.deletingModal.hasError.buttons.close')}
          </ModalButtonLabel>
        </ModalButton>
      </>
    ) : (
      <>
        <ModalTitle>{i18n.t('settings.deleteAccount.deletingModal.title')}</ModalTitle>
        <ActivityIndicatorWrapper>
          <ActivityIndicator size="large" />
        </ActivityIndicatorWrapper>
      </>
    )}
  </Modal>
);

export default DeletingAccountModal;
