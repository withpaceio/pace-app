import React, { type FC } from 'react';

import styled from 'styled-components/native';

import { ActivityIndicator, Text } from '@components/ui';

import i18n from '@translations/i18n';

import ActionsWrapper from './ActionsWrapper';

const WaitingText = styled(Text)`
  text-align: center;
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const PermissionsLoading: FC = () => (
  <ActionsWrapper>
    <ActivityIndicator />
    <WaitingText>{i18n.t('recordActivity.waitingForPermissions')}</WaitingText>
  </ActionsWrapper>
);

export default PermissionsLoading;
