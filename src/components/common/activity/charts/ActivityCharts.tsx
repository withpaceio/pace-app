import React, { type FC } from 'react';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { WarningIcon } from '@components/icons';
import { ActivityIndicator, Text } from '@components/ui';

import { ActivityLocation, ActivitySummary, ActivityType } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import i18n from '@translations/i18n';

import CyclingCharts from './cycling/CyclingCharts';
import RunningCharts from './running/RunningCharts';

const FetchingAndErrorWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: ${({ theme }) => theme.sizes.activityMapSnapshot.height}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const TextError = styled(Text)`
  color: ${({ theme }) => theme.colors.red};
  font-size: 16px;
  font-weight: bold;

  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
`;

type Props = {
  summary: Omit<ActivitySummary, 'name' | 'updatedAt'> & { name?: string };
  locations: ActivityLocation[] | null | undefined;
  locationsFetching: boolean;
  locationsError: boolean;
  distanceMeasurementSystem: DistanceMeasurementSystem;
};

const ActivityCharts: FC<Props> = ({
  summary,
  locations,
  locationsFetching,
  locationsError,
  distanceMeasurementSystem,
}) => {
  const theme = useTheme();

  if (!locations) {
    return (
      <FetchingAndErrorWrapper>
        {locationsFetching && !locationsError && <ActivityIndicator />}
        {!locationsFetching && locationsError && (
          <>
            <WarningIcon color={theme.colors.red} />
            <TextError>{i18n.t('activityDetails.errors.locations')}</TextError>
          </>
        )}
      </FetchingAndErrorWrapper>
    );
  }

  if (locations.length === 0) {
    return null;
  }

  switch (summary.type) {
    case ActivityType.CYCLING:
      return (
        <CyclingCharts
          summary={summary}
          locations={locations}
          distanceMeasurementSystem={distanceMeasurementSystem}
        />
      );
    case ActivityType.RUNNING:
      return (
        <RunningCharts
          summary={summary}
          locations={locations}
          distanceMeasurementSystem={distanceMeasurementSystem}
        />
      );
    default:
      return null;
  }
};

export default ActivityCharts;
