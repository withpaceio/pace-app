import React, { type FC } from 'react';

import styled from 'styled-components/native';

import { ActivityIndicator, Modal, ModalTitle } from '@components/ui';

const ActivityIndicatorWrapper = styled.View`
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = {
  visible: boolean;
  title: string;
};

const SigningProgressModal: FC<Props> = ({ visible, title }) => (
  <Modal visible={visible}>
    <ModalTitle>{title}</ModalTitle>
    <ActivityIndicatorWrapper>
      <ActivityIndicator size="large" />
    </ActivityIndicatorWrapper>
  </Modal>
);

export default SigningProgressModal;
