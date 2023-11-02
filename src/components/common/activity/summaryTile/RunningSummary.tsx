import React, { type FC, useMemo } from 'react';

import { convertPaceInMinutesPerMiles, formatPace } from '@activity';
import { useTheme } from '@theme';

import { RunningIcon } from '@components/icons';
import { Text } from '@components/ui';

import type { ActivitySummary } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import { ICON_SIZE } from './constants';
import DurationWrapper from './DurationWrapper';
import IconWrapper from './IconWrapper';
import StatsWrapper from './StatsWrapper';
import type { SummaryProps } from './types';

const RunningSummary: FC<SummaryProps> = ({
  activity,
  distanceMeasurementSystem,
  formattedDistance,
  formattedDuration,
}) => {
  const theme = useTheme();

  const formattedPace = useMemo(() => {
    const activityPace = (activity.summary as ActivitySummary).pace;
    const pace =
      distanceMeasurementSystem === DistanceMeasurementSystem.METRIC
        ? activityPace
        : convertPaceInMinutesPerMiles(activityPace);

    return formatPace(pace, distanceMeasurementSystem);
  }, [activity.summary, distanceMeasurementSystem]);

  return (
    <StatsWrapper>
      <IconWrapper>
        <RunningIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
      </IconWrapper>
      <Text>{formattedDistance}</Text>
      <DurationWrapper>
        <Text>{formattedDuration}</Text>
      </DurationWrapper>
      <Text>{formattedPace}</Text>
    </StatsWrapper>
  );
};

export default RunningSummary;
