import React, { type FC } from 'react';

import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';
import styled from 'styled-components/native';

import { ActivityIndicator, Modal, ModalTitle } from '@components/ui';

import i18n from '@translations/i18n';

const ActivityIndicatorWrapper = styled.View`
  margin: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = {
  packageItem: PurchasesPackage | null;
  isPurchasing: boolean;
};

const PurchasingModal: FC<Props> = ({ packageItem, isPurchasing }) => (
  <Modal visible={isPurchasing}>
    <ModalTitle>
      {i18n.t(
        `paywall.purchasingModal.${
          packageItem?.packageType === PACKAGE_TYPE.MONTHLY ? 'monthly' : 'yearly'
        }`,
      )}
    </ModalTitle>
    <ActivityIndicatorWrapper>
      <ActivityIndicator size="large" />
    </ActivityIndicatorWrapper>
  </Modal>
);

export default PurchasingModal;
