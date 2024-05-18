import React, { type FC } from 'react';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { WarningIcon } from '@components/icons';
import {
  Modal,
  ModalButton,
  ModalButtonLabel,
  ModalSeparator,
  ModalSubtitle,
  ModalTitle,
} from '@components/ui';

import useCurrentSubscription from '@subscription/useCurrentSubscription';

import i18n from '@translations/i18n';

const IconWrapper = styled.View`
  margin-top: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = {
  visible: boolean;
  onClose: () => void;
};

const DeleteAccountWarningModal: FC<Props> = ({ visible, onClose }) => {
  const theme = useTheme();

  const { currentSubscription } = useCurrentSubscription();

  return (
    <Modal visible={visible}>
      <IconWrapper>
        <WarningIcon color={theme.colors.red} />
      </IconWrapper>
      <ModalTitle>{i18n.t('settings.deleteAccount.requiredActionModal.title')}</ModalTitle>
      <ModalSubtitle>
        {i18n.t('settings.deleteAccount.requiredActionModal.explanation', {
          store: currentSubscription?.store === 'PLAY_STORE' ? 'Google Play' : 'App Store',
        })}
      </ModalSubtitle>
      <ModalSeparator />
      <ModalButton onPress={onClose}>
        <ModalButtonLabel>
          {i18n.t('settings.deleteAccount.requiredActionModal.buttons.close')}
        </ModalButtonLabel>
      </ModalButton>
    </Modal>
  );
};

export default DeleteAccountWarningModal;
