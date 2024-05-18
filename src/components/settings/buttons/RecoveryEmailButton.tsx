import React, { type FC, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';

import { useRouter } from 'expo-router';

import { useNetInfo } from '@react-native-community/netinfo';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import useRecoveryEmail from '@api/recoveryEmail/useRecoveryEmail';
import useResendRecoveryEmail from '@api/recoveryEmail/useResendRecoveryEmail';

import { AtIcon, CheckIcon, RotateLeftIcon, WarningIcon } from '@components/icons';
import { ActivityIndicator, SecondaryButton, Text } from '@components/ui';

import i18n from '@translations/i18n';

import {
  ConfigureWrapper,
  EntryWrapper,
  ICON_SIZE,
  IconWrapper,
  Label,
  SecondaryLabel,
} from './common';

const NotConfiguredStatus = styled(Text)`
  color: ${({ theme }) => theme.colors.red};
  font-weight: bold;
`;

const NotVerifiedStatus = styled(Text)`
  color: ${({ theme }) => theme.colors.orange};
  font-weight: bold;
`;

const VerifiedStatus = styled(Text)`
  color: ${({ theme }) => theme.colors.green};
  font-weight: bold;
`;

const EmailSentStatusText = styled(Text)`
  padding-top: 13px;
  padding-bottom: 13px;
  margin-left: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const EmailSentSuccessText = styled(EmailSentStatusText)`
  color: ${({ theme }) => theme.colors.green};
`;

const EmailSentFailureText = styled(EmailSentStatusText)`
  color: ${({ theme }) => theme.colors.red};
`;

const ResendWrapper = styled.View<{ width: number }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: ${({ width }) => width - 60}px;
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding}px;
  margin-left: ${({ theme }) => theme.sizes.outerPadding + theme.sizes.innerPadding}px;
`;

const ResendButtonWrapper = styled.View`
  width: 100%;
`;

const RecoveryEmailButton: FC = () => {
  const { isInternetReachable } = useNetInfo();
  const { width: windowWidth } = useWindowDimensions();

  const router = useRouter();
  const theme = useTheme();

  const { data: recoveryEmailData, isFetching } = useRecoveryEmail();
  const {
    mutate: resendRecoveryEmail,
    isIdle,
    isPending,
    isError,
    isSuccess,
  } = useResendRecoveryEmail();

  const onConfigureRecoveryEmail = useCallback(() => {
    router.push({
      pathname: '/settings/recovery-email',
      params: { recoveryEmail: recoveryEmailData?.email },
    });
  }, [recoveryEmailData?.email, router]);

  return (
    <>
      <EntryWrapper onPress={onConfigureRecoveryEmail} disabled={!isInternetReachable}>
        <IconWrapper>
          <AtIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
        </IconWrapper>
        <ConfigureWrapper>
          <Label>{i18n.t('settings.recoveryEmail.label')}</Label>
          {recoveryEmailData?.email && (
            <>
              <SecondaryLabel>{recoveryEmailData.email}</SecondaryLabel>
              {recoveryEmailData.isVerified ? (
                <VerifiedStatus>{i18n.t('settings.recoveryEmail.verified')}</VerifiedStatus>
              ) : (
                <NotVerifiedStatus>
                  {i18n.t('settings.recoveryEmail.notVerified')}
                </NotVerifiedStatus>
              )}
            </>
          )}
          {!recoveryEmailData && isFetching && <ActivityIndicator />}
          {!recoveryEmailData?.email && !isFetching && (
            <NotConfiguredStatus>
              {i18n.t('settings.recoveryEmail.notConfigured')}
            </NotConfiguredStatus>
          )}
        </ConfigureWrapper>
      </EntryWrapper>
      {recoveryEmailData?.email && !recoveryEmailData.isVerified && (
        <ResendWrapper width={windowWidth}>
          {!isIdle && isPending && (
            <>
              <ActivityIndicator />
              <EmailSentStatusText>
                {i18n.t('settings.resendVerificationEmailStatus.sending')}
              </EmailSentStatusText>
            </>
          )}
          {isSuccess && (
            <>
              <CheckIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.green} />
              <EmailSentSuccessText>
                {i18n.t('settings.resendVerificationEmailStatus.success')}
              </EmailSentSuccessText>
            </>
          )}
          {!isIdle && !isPending && isError && (
            <>
              <WarningIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.red} />
              <EmailSentFailureText>
                {i18n.t('settings.resendVerificationEmailStatus.failure')}
              </EmailSentFailureText>
            </>
          )}
          {isIdle && !isPending && !isError && (
            <ResendButtonWrapper>
              <SecondaryButton
                label={i18n.t('settings.buttons.resendVerification')}
                onPress={() => resendRecoveryEmail()}
                Icon={RotateLeftIcon}
                disabled={!isInternetReachable || isFetching}
              />
            </ResendButtonWrapper>
          )}
        </ResendWrapper>
      )}
    </>
  );
};

export default RecoveryEmailButton;
