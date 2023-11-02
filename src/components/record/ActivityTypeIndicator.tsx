import React, { type FC } from 'react';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import ActivityIcon from '@components/common/activity/ActivityIcon';

import { ActivityType } from '@models/Activity';

const Wrapper = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 50px;
  height: 50px;
  border-radius: 25px;

  background-color: ${({ theme }) =>
    theme.dark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};

  border-width: 1px;
  border-color: ${({ disabled, theme }) =>
    disabled
      ? theme.colors.buttons.secondary.disabled.border
      : theme.colors.buttons.secondary.enabled.border};
  border-style: solid;
`;

type Props = {
  activityType: ActivityType;
  disabled?: boolean;
  onOpenActivityTypeSheet?: () => void;
};

const ActivityTypeIndicator: FC<Props> = ({ activityType, disabled, onOpenActivityTypeSheet }) => {
  const theme = useTheme();

  return (
    <Wrapper disabled={disabled} onPress={onOpenActivityTypeSheet}>
      <ActivityIcon
        activityType={activityType}
        width={20}
        height={20}
        color={theme.colors.primary}
      />
    </Wrapper>
  );
};

export default ActivityTypeIndicator;
