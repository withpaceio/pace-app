import React, { type FC, useMemo } from 'react';

import { differenceInDays, format, formatRelative } from 'date-fns';
import styled from 'styled-components/native';

import { formatDistance, formatDuration } from '@activity';

import { ActivityIndicator, Text } from '@components/ui';

import { Activity, ActivitySummary, ActivityType } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';
import i18n from '@translations/i18n';

import CyclingSummary from './CyclingSummary';
import RunningSummary from './RunningSummary';

const Wrapper = styled.View`
  display: flex;
  flex-direction: column;

  padding-horizontal: ${({ theme }) => theme.sizes.innerPadding}px;
  padding-bottom: ${({ theme }) => theme.sizes.innerPadding}px;

  min-height: 50px;
  width: 100%;
`;

const HeaderWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: baseline;

  margin-top: 5px;
  margin-bottom: ${({ theme }) => 0.5 * theme.sizes.innerPadding}px;
`;

const Name = styled(Text)`
  font-size: 16px;
  font-weight: bold;
`;

const CreatedAtWrapper = styled.View`
  align-self: flex-end;
`;

const CreatedAt = styled(Text)`
  margin-bottom: 4px;

  font-style: italic;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ErrorLoadingWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const Loading = styled(Text)`
  text-align: center;
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const Error = styled.Text`
  color: ${({ theme }) => theme.colors.red};
  font-size: 16px;
  text-align: center;
`;

type Props = {
  activity: Activity;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  hasError: boolean;
};

const ActivitySummaryTileUI: FC<Props> = ({ activity, distanceMeasurementSystem, hasError }) => {
  const activityDate = useMemo(() => {
    if (!activity?.summary) {
      return '';
    }

    const now = Date.now();
    const createdAtDate = new Date((activity.summary as ActivitySummary).createdAt);
    const relativetoNow = Math.abs(differenceInDays(createdAtDate, now));
    if (relativetoNow < 6) {
      return formatRelative(createdAtDate, now);
    }

    const formattedDate = format(createdAtDate, 'EEEE, LLLL dd, yyyy');
    const formattedHour = format(createdAtDate, 'h:mm a');
    return `${formattedDate}, ${i18n.t('activityTile.atHour')} ${formattedHour}`;
  }, [activity?.summary]);

  const formattedDistance = useMemo(() => {
    if (!activity?.summary) {
      return '';
    }

    return formatDistance(
      (activity.summary as ActivitySummary).distance,
      distanceMeasurementSystem,
    );
  }, [activity?.summary, distanceMeasurementSystem]);

  const formattedDuration = useMemo(() => {
    if (!activity?.summary) {
      return '';
    }

    return formatDuration((activity.summary as ActivitySummary).duration);
  }, [activity?.summary]);

  return (
    <Wrapper>
      {!activity?.summary && !hasError && (
        <ErrorLoadingWrapper>
          <ActivityIndicator />
          <Loading>{i18n.t('activityTile.decrypting')}</Loading>
        </ErrorLoadingWrapper>
      )}
      {activity?.summary && (
        <>
          <HeaderWrapper>
            <CreatedAtWrapper id={`activity.${activity.id}.createdAt`}>
              <CreatedAt>{activityDate}</CreatedAt>
            </CreatedAtWrapper>
            <Name>{(activity.summary as ActivitySummary).name}</Name>
          </HeaderWrapper>
          {(activity.summary as ActivitySummary).type === ActivityType.RUNNING && (
            <RunningSummary
              activity={activity}
              distanceMeasurementSystem={distanceMeasurementSystem}
              formattedDistance={formattedDistance}
              formattedDuration={formattedDuration}
            />
          )}
          {(activity.summary as ActivitySummary).type === ActivityType.CYCLING && (
            <CyclingSummary
              activity={activity}
              distanceMeasurementSystem={distanceMeasurementSystem}
              formattedDistance={formattedDistance}
              formattedDuration={formattedDuration}
            />
          )}
        </>
      )}
      {hasError && (
        <ErrorLoadingWrapper>
          <Error>{i18n.t('activityTile.errors.decrypting')}</Error>
        </ErrorLoadingWrapper>
      )}
    </Wrapper>
  );
};

export default ActivitySummaryTileUI;
