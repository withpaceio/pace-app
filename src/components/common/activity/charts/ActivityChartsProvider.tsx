import React, { type FC, createContext, useContext } from 'react';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { WarningIcon } from '@components/icons';
import { ActivityIndicator, Text } from '@components/ui';

import i18n from '@translations/i18n';

import ActivityCharts from './ActivityCharts';
import type { ChartsContextValue, ChartsProps } from './types';

const ActivityChartsContext = createContext<ChartsContextValue | undefined>(undefined);

export const useActivityCharts = (): ChartsContextValue => {
  const values = useContext(ActivityChartsContext);
  if (!values) {
    throw new Error('Accessing ActivityChartsContext from outside its children');
  }

  return values;
};

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

const ActivityChartsProvider: FC<ChartsProps> = ({
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

  return (
    <ActivityChartsContext.Provider
      value={{
        summary,
        locations,
        distanceMeasurementSystem,
      }}>
      <ActivityCharts activityType={summary.type} />
    </ActivityChartsContext.Provider>
  );
};

export default ActivityChartsProvider;
