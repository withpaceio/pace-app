import React, { type FC } from 'react';

import styled from 'styled-components/native';

import {
  ActivityIndicator,
  Modal,
  ModalButton,
  ModalButtonLabel,
  ModalGreenButtonLabel,
  ModalSeparator,
  ModalSubtitle,
  ModalTitle,
} from '@components/ui';

const ActivityIndicatorWrapper = styled.View`
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = {
  title: string;
  errorMessage: string;
  saving: boolean;
  hasError: boolean;
  retryLabel: string;
  discardLabel: string;
  onRetry: () => void;
  onDiscard: () => void;
};

const SavingModal: FC<Props> = ({
  title,
  errorMessage,
  saving,
  hasError,
  retryLabel,
  discardLabel,
  onRetry,
  onDiscard,
}) => (
  <Modal visible={saving || hasError}>
    <ModalTitle>{title}</ModalTitle>
    {saving && !hasError && (
      <ActivityIndicatorWrapper>
        <ActivityIndicator size="large" />
      </ActivityIndicatorWrapper>
    )}
    {!saving && hasError && (
      <>
        <ModalSubtitle>{errorMessage}</ModalSubtitle>
        <ModalSeparator />
        <ModalButton onPress={onRetry}>
          <ModalGreenButtonLabel>{retryLabel}</ModalGreenButtonLabel>
        </ModalButton>
        <ModalSeparator />
        <ModalButton onPress={onDiscard}>
          <ModalButtonLabel>{discardLabel}</ModalButtonLabel>
        </ModalButton>
      </>
    )}
  </Modal>
);

export default SavingModal;
