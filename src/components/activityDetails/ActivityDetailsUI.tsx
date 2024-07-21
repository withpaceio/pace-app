import { type FC, useMemo } from 'react';

import { differenceInDays, format, formatRelative } from 'date-fns';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import useActivityLocations from '@api/activity/useActivityLocations';
import useActivityMapSnapshot from '@api/activity/useActivityMapSnapshot';

import ActivityIcon from '@components/common/activity/ActivityIcon';
import ActivityChartsProvider from '@components/common/activity/charts/ActivityChartsProvider';
import ActivityStatistics from '@components/common/activity/statistics/ActivityStatistics';
import { CloseIcon } from '@components/icons';
import { Text } from '@components/ui';

import type { Activity, ActivitySummary } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import i18n from '@translations/i18n';

const ICON_SIZE = 15;

const Wrapper = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderWrapper = styled.View`
  position: fixed;

  width: 60%;
  height: 50px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: ${({ theme }) => theme.sizes.innerPadding}px;

  border-color: ${({ theme }) => theme.colors.separatorColor};
  border-top-width: 1px;
  border-bottom-width: 1px;

  background-color: ${({ theme }) => theme.colors.background};

  z-index: 2;
`;

const TitleIconWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const HeaderTitleWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2px;
`;

const HeaderTitle = styled(Text)`
  font-size: 0.8rem;
  font-weight: bold;
`;

const CreatedAt = styled(Text)`
  font-size: 0.75rem;
  font-style: italic;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ActivityIconWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: ${ICON_SIZE + 14}px;
  height: ${ICON_SIZE + 14}px;
  border-radius: ${ICON_SIZE / 2 + 7}px;

  background-color: ${({ theme }) => theme.colors.darkComponentBackground};
`;

const CloseIconWrapper = styled.Pressable`
  padding: 5px;
  border-radius: 5px;
  transition: background-color 0.25s ease-out;
`;

const MapImage = styled.Image`
  width: calc(100% - 2 * ${({ theme }) => theme.sizes.outerPadding}px);
  max-width: 800px;
  align-self: center;

  margin-horizontal: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding}px;
  margin-top: 75px;

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
  onCloseActivityDetails: () => void;
  onDeleteActivity: () => void;
};
const ActivityDetailsUI: FC<Props> = ({
  activity,
  distanceMeasurementSystem,
  onCloseActivityDetails,
}) => {
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
        <TitleIconWrapper>
          <ActivityIconWrapper>
            <ActivityIcon
              activityType={activity!.summary.type}
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          </ActivityIconWrapper>
          <HeaderTitleWrapper>
            <HeaderTitle>{activity?.summary.name}</HeaderTitle>
            <CreatedAt>{activityDate}</CreatedAt>
          </HeaderTitleWrapper>
        </TitleIconWrapper>
        <CloseIconWrapper
          // @ts-expect-error
          style={({ hovered }) =>
            hovered
              ? { backgroundColor: theme.colors.darkComponentBackground }
              : { backgroundColor: theme.colors.componentBackground }
          }
          onPress={onCloseActivityDetails}>
          <CloseIcon width={ICON_SIZE} height={ICON_SIZE} />
        </CloseIconWrapper>
      </HeaderWrapper>
      {mapSnapshotData && <MapImage source={{ uri: mapSnapshotData.mapSnapshot }} />}
      {activity?.summary && (
        <>
          <ActivityStatistics
            summary={activity.summary}
            locations={activityLocationsData?.locations}
            distanceMeasurementSystem={distanceMeasurementSystem}
          />
          <ChartsWrapper>
            <ActivityChartsProvider
              summary={activity.summary}
              locations={activityLocationsData?.locations}
              locationsFetching={isActivityLocationsLoading}
              locationsError={isActivityLocationsError}
              distanceMeasurementSystem={distanceMeasurementSystem}
            />
          </ChartsWrapper>
        </>
      )}
    </Wrapper>
  );
};

export default ActivityDetailsUI;
