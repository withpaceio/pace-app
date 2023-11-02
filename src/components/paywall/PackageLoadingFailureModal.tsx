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
} from '@components/ui';

import i18n from '@translations/i18n';

const IconWrapper = styled.View`
  margin: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = {
  visible: boolean;
  onClose: () => void;
};

const PackageLoadingFailureModal: FC<Props> = ({ visible, onClose }) => {
  const theme = useTheme();

  return (
    <Modal visible={visible}>
      <IconWrapper>
        <WarningIcon color={theme.colors.red} />
      </IconWrapper>
      <ModalSubtitle>{i18n.t('paywall.packageLoadingFailureModal.errorMessage')}</ModalSubtitle>
      <ModalSeparator />
      <ModalButton onPress={onClose}>
        <ModalButtonLabel>{i18n.t('paywall.packageLoadingFailureModal.close')}</ModalButtonLabel>
      </ModalButton>
    </Modal>
  );
};

export default PackageLoadingFailureModal;
