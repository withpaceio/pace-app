import React, { type FC, useMemo } from 'react';

import { formatElevation, getElevationInMeters } from '@activity';
import { useTheme } from '@theme';

import useActivityLocations from '@api/activity/useActivityLocations';

import { CyclingIcon } from '@components/icons';
import { Text } from '@components/ui';

import { ICON_SIZE } from './constants';
import DurationWrapper from './DurationWrapper';
import IconWrapper from './IconWrapper';
import StatsWrapper from './StatsWrapper';
import type { SummaryProps } from './types';

const CyclingSummary: FC<SummaryProps> = ({
  activity,
  distanceMeasurementSystem,
  formattedDistance,
  formattedDuration,
}) => {
  const theme = useTheme();

  const { data: activityLocationsData } = useActivityLocations({
    activityId: activity.id,
    activityEncryptionKey: activity.encryptionKey,
  });

  const formattedElevation = useMemo(() => {
    if (!activityLocationsData) {
      return null;
    }

    const activityElevation = getElevationInMeters(activityLocationsData.locations);

    return formatElevation(activityElevation, distanceMeasurementSystem);
  }, [activityLocationsData, distanceMeasurementSystem]);

  return (
    <StatsWrapper>
      <IconWrapper>
        <CyclingIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
      </IconWrapper>
      <Text>{formattedDistance}</Text>
      <DurationWrapper>
        <Text>{formattedDuration}</Text>
      </DurationWrapper>
      <Text>{formattedElevation}</Text>
    </StatsWrapper>
  );
};

export default CyclingSummary;
