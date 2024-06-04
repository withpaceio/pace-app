import React, { type FC, useCallback, useEffect, useState } from 'react';

import { usePathname } from 'expo-router';

import styled from 'styled-components/native';

import {
  ActivityIndicator,
  Modal,
  ModalButton,
  ModalGreenButtonLabel,
  ModalSeparator,
  ModalTitle,
} from '@components/ui';

import i18n from '@translations/i18n';

const ActivityIndicatorWrapper = styled.View`
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = {
  isOpen: boolean;
  signOut: () => Promise<void>;
  close: () => void;
};

const LoggedOutModal: FC<Props> = ({ isOpen, signOut, close }) => {
  const pathname = usePathname();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const onSignOut = useCallback(async (): Promise<void> => {
    setIsSigningOut(true);

    await signOut();

    close();
    setIsSigningOut(false);
  }, [close, signOut]);

  useEffect(() => {
    if (pathname === '/auth' && isOpen) {
      close();
    }
  }, [close, isOpen, pathname]);

  if (pathname === '/auth') {
    return null;
  }

  return (
    <Modal visible={isOpen}>
      {isSigningOut ? (
        <>
          <ModalTitle>{i18n.t('sessionExpiredModal.signingOut')}</ModalTitle>
          <ActivityIndicatorWrapper>
            <ActivityIndicator size="large" />
          </ActivityIndicatorWrapper>
        </>
      ) : (
        <>
          <ModalTitle>{i18n.t('sessionExpiredModal.title')}</ModalTitle>
          <ModalSeparator />
          <ModalButton onPress={onSignOut}>
            <ModalGreenButtonLabel>
              {i18n.t('sessionExpiredModal.goToButton')}
            </ModalGreenButtonLabel>
          </ModalButton>
        </>
      )}
    </Modal>
  );
};

export default LoggedOutModal;
