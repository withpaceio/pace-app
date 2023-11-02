import React, { type FC } from 'react';

import styled from 'styled-components/native';

import { ActivityIndicator, Modal, ModalTitle } from '@components/ui';

import i18n from '@translations/i18n';

const ActivityIndicatorWrapper = styled.View`
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = {
  visible: boolean;
};

const SigningOutModal: FC<Props> = ({ visible }) => (
  <Modal visible={visible}>
    <ModalTitle>{i18n.t('settings.signingOut')}</ModalTitle>
    <ActivityIndicatorWrapper>
      <ActivityIndicator />
    </ActivityIndicatorWrapper>
  </Modal>
);

export default SigningOutModal;
