import React, { type FC, useMemo } from 'react';

import {
  formatCalories,
  formatDistance,
  formatDuration,
  formatElevation,
  formatSpeed,
  getElevationGainInMeters,
  getMovingDurationInSeconds,
} from '@activity';

import i18n from '@translations/i18n';

import {
  InnerWrapper,
  RowWrapper,
  StatTitle,
  StatValue,
  StatWrapper,
  Wrapper,
} from './common-components';
import type { ActivityStatisticsProps } from './types';

const CyclingStatistics: FC<ActivityStatisticsProps> = ({
  summary,
  locations,
  distanceMeasurementSystem,
}) => {
  const { distance, duration, pace, calories } = summary;

  const formattedDistance = useMemo(
    () => formatDistance(distance, distanceMeasurementSystem),
    [distance, distanceMeasurementSystem],
  );

  const formattedDuration = useMemo(() => formatDuration(duration), [duration]);

  const formattedMovingDuration = useMemo(() => {
    if (!locations || locations[0].segment === undefined) {
      return formattedDuration;
    }

    return formatDuration(getMovingDurationInSeconds(locations));
  }, [formattedDuration, locations]);

  const formattedElevation = useMemo(() => {
    if (!locations) {
      return '-';
    }

    const elevation = getElevationGainInMeters(locations);
    return formatElevation(elevation, distanceMeasurementSystem);
  }, [distanceMeasurementSystem, locations]);

  const formattedSpeed = useMemo(
    () => formatSpeed(pace, distanceMeasurementSystem),
    [distanceMeasurementSystem, pace],
  );

  const formattedCalories = useMemo(() => {
    if (!calories) {
      return null;
    }

    return formatCalories(calories);
  }, [calories]);

  return (
    <Wrapper>
      <InnerWrapper>
        <RowWrapper>
          <StatWrapper>
            <StatTitle>{i18n.t('activityDetails.elapsedTime')}</StatTitle>
            <StatValue>{formattedDuration}</StatValue>
          </StatWrapper>
          <StatWrapper>
            <StatTitle>{i18n.t('activityDetails.movingTime')}</StatTitle>
            <StatValue>{formattedMovingDuration}</StatValue>
          </StatWrapper>
        </RowWrapper>
        <RowWrapper>
          <StatWrapper>
            <StatTitle>{i18n.t('activityDetails.distance')}</StatTitle>
            <StatValue>{formattedDistance}</StatValue>
          </StatWrapper>
          <StatWrapper>
            <StatTitle>{i18n.t('activityDetails.speed')}</StatTitle>
            <StatValue>{formattedSpeed}</StatValue>
          </StatWrapper>
        </RowWrapper>
        <RowWrapper>
          <StatWrapper>
            <StatTitle>{i18n.t('activityDetails.elevationGain')}</StatTitle>
            <StatValue>{formattedElevation}</StatValue>
          </StatWrapper>
          <StatWrapper>
            <StatTitle>{i18n.t('activityDetails.calories')}</StatTitle>
            <StatValue>{formattedCalories || '-'}</StatValue>
          </StatWrapper>
        </RowWrapper>
      </InnerWrapper>
    </Wrapper>
  );
};

export default CyclingStatistics;
