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

import i18n from '@translations/i18n';

const IconWrapper = styled.View`
  margin-top: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = {
  visible: boolean;
  title: string | null;
  purchasesErrorMessage: string | null;
  purchasesTechnicalErrorMessage: string | null;
  purchasesUnderlyingErrorMessage: string | null;
  onClose: () => void;
};

const PurchasingModalFailure: FC<Props> = ({
  visible,
  title,
  purchasesErrorMessage,
  purchasesTechnicalErrorMessage,
  purchasesUnderlyingErrorMessage,
  onClose,
}) => {
  const theme = useTheme();

  return (
    <Modal visible={visible}>
      <IconWrapper>
        <WarningIcon color={theme.colors.red} />
      </IconWrapper>
      <ModalTitle>{title || i18n.t('paywall.purchasingFailureModal.title')}</ModalTitle>
      <ModalSubtitle>
        {purchasesErrorMessage || i18n.t('paywall.purchasingFailureModal.errorMessages.unknown')}
      </ModalSubtitle>
      {purchasesTechnicalErrorMessage && (
        <>
          <ModalSeparator />
          <ModalSubtitle>{purchasesTechnicalErrorMessage}</ModalSubtitle>
        </>
      )}
      {purchasesUnderlyingErrorMessage && (
        <>
          <ModalSeparator />
          <ModalSubtitle>{purchasesUnderlyingErrorMessage}</ModalSubtitle>
        </>
      )}
      <ModalSeparator />
      <ModalButton onPress={onClose}>
        <ModalButtonLabel>{i18n.t('paywall.purchasingFailureModal.close')}</ModalButtonLabel>
      </ModalButton>
    </Modal>
  );
};

export default PurchasingModalFailure;
