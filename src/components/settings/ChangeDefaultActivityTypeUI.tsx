import React, { type FC } from 'react';

import Checkbox from 'expo-checkbox';
import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import ActivityIcon from '@components/common/activity/ActivityIcon';
import SavingModal from '@components/common/SavingModal';
import { Text } from '@components/ui';

import { ActivityType } from '@models/Activity';
import i18n from '@translations/i18n';

import type { ChangeDefaultActivityTypeData } from './types';

const ICON_SIZE = 25;

const Wrapper = styled.View`
  flex: 1;
  overflow: visible;

  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const ActivityWrapper = styled.Pressable<{ isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  border-width: ${({ isSelected }) => (isSelected ? 2 : 1)}px;
  border-color: ${({ theme }) => theme.colors.purple}
  border-radius: 10px;

  padding: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const IconWrapper = styled.View`
  margin-left: ${({ theme }) => theme.sizes.innerPadding}px;
  margin-right: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const Label = styled(Text)`
  font-size: 16px;
`;

type Props = {
  isLoading: boolean;
  hasError: boolean;
  onSubmit: () => void;
  onDiscard: () => void;
};

const ChangeDefaultActivityTypeUI: FC<Props> = ({ isLoading, hasError, onSubmit, onDiscard }) => {
  const { control } = useFormContext<ChangeDefaultActivityTypeData>();
  const theme = useTheme();

  return (
    <Wrapper>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <ActivityWrapper
              isSelected={value === ActivityType.RUNNING}
              onPress={() => onChange(ActivityType.RUNNING)}>
              <Checkbox
                value={value === ActivityType.RUNNING}
                color={
                  value === ActivityType.RUNNING ? theme.colors.purple : theme.colors.separatorColor
                }
                onValueChange={() => onChange(ActivityType.RUNNING)}
              />
              <IconWrapper>
                <ActivityIcon
                  activityType={ActivityType.RUNNING}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  color={theme.colors.primary}
                />
              </IconWrapper>
              <Label>{i18n.t('activityType.running')}</Label>
            </ActivityWrapper>
            <ActivityWrapper
              isSelected={value === ActivityType.CYCLING}
              onPress={() => onChange(ActivityType.CYCLING)}>
              <Checkbox
                value={value === ActivityType.CYCLING}
                color={
                  value === ActivityType.CYCLING ? theme.colors.purple : theme.colors.separatorColor
                }
                onValueChange={() => onChange(ActivityType.CYCLING)}
              />
              <IconWrapper>
                <ActivityIcon
                  activityType={ActivityType.CYCLING}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  color={theme.colors.primary}
                />
              </IconWrapper>
              <Label>{i18n.t('activityType.cycling')}</Label>
            </ActivityWrapper>
          </>
        )}
        name="defaultActivityType"
      />
      <SavingModal
        title={i18n.t('settings.defaultActivityType.savingModal.title')}
        errorMessage={i18n.t('settings.defaultActivityType.savingModal.error')}
        saving={isLoading}
        hasError={hasError}
        retryLabel={i18n.t('settings.defaultActivityType.savingModal.buttons.retry')}
        discardLabel={i18n.t('settings.defaultActivityType.savingModal.buttons.discard')}
        onRetry={onSubmit}
        onDiscard={onDiscard}
      />
    </Wrapper>
  );
};

export default ChangeDefaultActivityTypeUI;
