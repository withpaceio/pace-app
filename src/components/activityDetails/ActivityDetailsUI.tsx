import { type FC, useMemo } from 'react';

import { differenceInDays, format, formatRelative } from 'date-fns';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import useActivityLocations from '@api/activity/useActivityLocations';
import useActivityMapSnapshot from '@api/activity/useActivityMapSnapshot';

import ActivityIcon from '@components/common/activity/ActivityIcon';
import ActivityChartsProvider from '@components/common/activity/charts/ActivityChartsProvider';
import { Text } from '@components/ui';

import type { Activity, ActivitySummary } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import i18n from '@translations/i18n';

const Wrapper = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderWrapper = styled.View`
  position: fixed;
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: ${({ theme }) => theme.sizes.innerPadding}px;

  padding: ${({ theme }) => theme.sizes.outerPadding}px;
  border-bottom-color: ${({ theme }) => theme.colors.separatorColor};
  border-bottom-width: 1px;

  background-color: ${({ theme }) => theme.colors.componentBackground};

  z-index: 2;
`;

const HeaderTitleWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2px;
`;

const HeaderTitle = styled(Text)`
  font-size: 18px;
  font-weight: bold;
`;

const CreatedAt = styled(Text)`
  font-style: italic;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ActivityIconWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 36px;
  height: 36px;
  border-radius: 23px;

  background-color: ${({ theme }) => theme.colors.darkComponentBackground};
`;

const MapImage = styled.Image`
  width: 100%;
  max-width: 500px;
  align-self: center;

  margin: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-top: 100px;

  aspect-ratio: 8/5;

  border-radius: 8px;
`;

const ChartsWrapper = styled.View`
  padding-left: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-right: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = {
  activity: Activity | undefined;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  onDeleteActivity: () => void;
};
const ActivityDetailsUI: FC<Props> = ({ activity, distanceMeasurementSystem }) => {
  const theme = useTheme();

  const {
    data: mapSnapshotData,
    isLoading: isMapSnapshotLoading,
    isError: isMapSnapshotError,
  } = useActivityMapSnapshot({
    activityId: activity?.id,
    activityEncryptionKey: activity?.encryptionKey,
    mapSnapshotTheme: theme.dark ? 'dark' : 'light',
  });

  const {
    data: activityLocationsData,
    isLoading: isActivityLocationsLoading,
    isError: isActivityLocationsError,
  } = useActivityLocations({
    activityId: activity?.id,
    activityEncryptionKey: activity?.encryptionKey,
  });

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
    return `${formattedDate}, ${i18n.t('activityDetails.atHour')} ${formattedHour}`;
  }, [activity?.summary]);

  return (
    <Wrapper>
      <HeaderWrapper>
        <ActivityIconWrapper>
          <ActivityIcon activityType={activity!.summary.type} width={20} height={20} />
        </ActivityIconWrapper>
        <HeaderTitleWrapper>
          <HeaderTitle>{activity?.summary.name}</HeaderTitle>
          <CreatedAt>{activityDate}</CreatedAt>
        </HeaderTitleWrapper>
      </HeaderWrapper>
      {mapSnapshotData && <MapImage source={{ uri: mapSnapshotData.mapSnapshot }} />}
      {activity?.summary && (
        <ChartsWrapper>
          <ActivityChartsProvider
            summary={activity.summary}
            locations={activityLocationsData?.locations}
            locationsFetching={isActivityLocationsLoading}
            locationsError={isActivityLocationsError}
            distanceMeasurementSystem={distanceMeasurementSystem}
          />
        </ChartsWrapper>
      )}
    </Wrapper>
  );
};

export default ActivityDetailsUI;
