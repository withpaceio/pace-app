import React, { type FC } from 'react';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { WarningIcon } from '@components/icons';
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

const IconWrapper = styled.View`
  margin-top: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDeleteAccountModal: FC<Props> = ({ visible, onConfirm, onCancel }) => {
  const theme = useTheme();

  return (
    <Modal visible={visible}>
      <IconWrapper>
        <WarningIcon color={theme.colors.red} />
      </IconWrapper>
      <ModalTitle>{i18n.t('settings.deleteAccount.confirmModal.title')}</ModalTitle>
      <ModalSubtitle>{i18n.t('settings.deleteAccount.confirmModal.explanation')}</ModalSubtitle>
      <ModalSeparator />
      <ModalButton onPress={onConfirm}>
        <ModalRedButtonLabel>
          {i18n.t('settings.deleteAccount.confirmModal.buttons.confirm')}
        </ModalRedButtonLabel>
      </ModalButton>
      <ModalSeparator />
      <ModalButton onPress={onCancel}>
        <ModalButtonLabel>
          {i18n.t('settings.deleteAccount.confirmModal.buttons.cancel')}
        </ModalButtonLabel>
      </ModalButton>
    </Modal>
  );
};

export default ConfirmDeleteAccountModal;
