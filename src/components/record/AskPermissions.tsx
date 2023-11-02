import React, { type FC } from 'react';
import { Linking } from 'react-native';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { WarningIcon } from '@components/icons';
import { PrimaryButton, Text } from '@components/ui';

import i18n from '@translations/i18n';

import ActionsWrapper from './ActionsWrapper';

const ExplanationText = styled(Text)`
  text-align: center;
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const OpenSettingsButton = styled(PrimaryButton)`
  width: 100%;
`;

const AskPermissions: FC = () => {
  const theme = useTheme();

  return (
    <ActionsWrapper>
      <WarningIcon color={theme.colors.red} />
      <ExplanationText>{i18n.t('recordActivity.permissionsError.explanation')}</ExplanationText>
      <OpenSettingsButton
        label={i18n.t('recordActivity.buttons.openSettings')}
        onPress={() => Linking.openSettings()}
      />
    </ActionsWrapper>
  );
};

export default AskPermissions;
