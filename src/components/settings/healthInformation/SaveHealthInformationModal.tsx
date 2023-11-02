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

import i18n from '@translations/i18n';

const ActivityIndicatorWrapper = styled.View`
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = {
  saving: boolean;
  hasError: boolean;
  onRetry: () => void;
  onDiscard: () => void;
};

const SaveHealthInformationModal: FC<Props> = ({ saving, hasError, onRetry, onDiscard }) => (
  <Modal visible={saving || hasError}>
    <ModalTitle>{i18n.t('settings.configureHealthInformation.saving')}</ModalTitle>
    {saving && !hasError && (
      <ActivityIndicatorWrapper>
        <ActivityIndicator size="large" />
      </ActivityIndicatorWrapper>
    )}
    {!saving && hasError && (
      <>
        <ModalSubtitle>
          {i18n.t('settings.configureHealthInformation.errors.failureMessage')}
        </ModalSubtitle>
        <ModalSeparator />
        <ModalButton onPress={onRetry}>
          <ModalGreenButtonLabel>
            {i18n.t('settings.configureHealthInformation.errors.retry')}
          </ModalGreenButtonLabel>
        </ModalButton>
        <ModalSeparator />
        <ModalButton onPress={onDiscard}>
          <ModalButtonLabel>
            {i18n.t('settings.configureHealthInformation.errors.discard')}
          </ModalButtonLabel>
        </ModalButton>
      </>
    )}
  </Modal>
);

export default SaveHealthInformationModal;
