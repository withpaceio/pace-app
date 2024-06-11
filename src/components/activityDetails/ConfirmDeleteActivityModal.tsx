import React, { type FC, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import styled from 'styled-components/native';

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

const BackdropView = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.backdropColor};
`;

type Props = {
  isOpen: boolean;
  isError: boolean;
  onDelete: () => void;
  onClose: () => void;
};

const ConfirmDeleteActivityModal: FC<Props> = ({ isOpen, isError, onDelete, onClose }) => {
  const backdropOpacityAnimated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isOpen && !isError) {
      return;
    }

    backdropOpacityAnimated.setValue(1);
  }, [backdropOpacityAnimated, isOpen, isError]);

  return (
    <>
      <Modal visible={isOpen || isError} hideBackdrop>
        {isError && (
          <>
            <ModalTitle>{i18n.t('activityDetails.confirmModal.failed')}</ModalTitle>
            <ModalSubtitle>{i18n.t('activityDetails.confirmModal.failed')}</ModalSubtitle>
            <ModalSeparator />
            <ModalButton onPress={onDelete}>
              <ModalRedButtonLabel>
                {i18n.t('activityDetails.confirmModal.buttons.retry')}
              </ModalRedButtonLabel>
            </ModalButton>
            <ModalSeparator />
            <ModalButton onPress={onClose}>
              <ModalButtonLabel>
                {i18n.t('activityDetails.confirmModal.buttons.cancel')}
              </ModalButtonLabel>
            </ModalButton>
          </>
        )}
        {!isError && (
          <>
            <ModalTitle>{i18n.t('activityDetails.confirmModal.question')}</ModalTitle>
            <ModalSubtitle>{i18n.t('activityDetails.confirmModal.explainer')}</ModalSubtitle>
            <ModalSeparator />
            <ModalButton onPress={onDelete}>
              <ModalRedButtonLabel>
                {i18n.t('activityDetails.confirmModal.buttons.delete')}
              </ModalRedButtonLabel>
            </ModalButton>
            <ModalSeparator />
            <ModalButton onPress={onClose}>
              <ModalButtonLabel>
                {i18n.t('activityDetails.confirmModal.buttons.cancel')}
              </ModalButtonLabel>
            </ModalButton>
          </>
        )}
      </Modal>
      {(isOpen || isError) && <BackdropView style={{ opacity: backdropOpacityAnimated }} />}
    </>
  );
};

export default ConfirmDeleteActivityModal;
