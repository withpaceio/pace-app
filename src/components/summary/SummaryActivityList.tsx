import React, { type FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { LayoutChangeEvent, ScrollView } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import ActivitySummaryTileUI from '@components/common/activity/summaryTile/ActivitySummaryTileUI';
import { ActivityIndicator, Text } from '@components/ui';

import type { Activity, ActivitySummary } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import i18n from '@translations/i18n';

const Wrapper = styled(LinearGradient)`
  flex: 1;
  border-radius: 20px;
`;

const ContentWrapper = styled.View`
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  padding-left: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-right: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-top: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-bottom: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const ActivityWrapper = styled.TouchableOpacity<{ isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: ${({ theme }) => theme.sizes.innerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding - 2}px;

  background-color: ${({ theme }) => theme.colors.componentBackground};

  shadow-color: ${({ theme }) => theme.colors.black};
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  shadow-offset: 0px 0px;
  elevation: 4;

  border-width: 1px;
  border-style: solid;
  border-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.purple : theme.colors.componentBackground};

  border-radius: 8px;
`;

const LoadingWrapper = styled.View`
  margin-top: ${({ theme }) => 2 * theme.sizes.outerPadding}px;
`;

const NoActivityText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
`;

type Props = {
  activities: Activity[] | null;
  selectedActivityIds: string[];
  distanceMeasurementSystem: DistanceMeasurementSystem;
};

const SummaryActivityList: FC<Props> = ({
  activities,
  selectedActivityIds,
  distanceMeasurementSystem,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const activityTileSummaryYs = useRef<Map<string, number>>(new Map()).current;

  const theme = useTheme();
  const router = useRouter();

  const sortedActivities = useMemo(() => {
    if (!activities) {
      return null;
    }

    return [...activities].sort((activity1, activity2) => {
      const summary1 = activity1.summary as ActivitySummary;
      const summary2 = activity2.summary as ActivitySummary;

      if (summary1.createdAt < summary2.createdAt) {
        return 1;
      }

      if (summary1.createdAt > summary2.createdAt) {
        return -1;
      }

      return 0;
    });
  }, [activities]);

  const colors = useMemo(() => {
    if (theme.dark) {
      return [theme.colors.background, theme.colors.background];
    }

    return [theme.colors.darkComponentBackground, theme.colors.componentBackground];
  }, [theme]);

  const onLayout = (activityId: string, event: LayoutChangeEvent): void => {
    const {
      nativeEvent: {
        layout: { y },
      },
    } = event;

    activityTileSummaryYs.set(activityId, y);
  };

  const goToActivityDetails = useCallback(
    (activityId: string): void => {
      router.push(`/activity/${activityId}`);
    },
    [router],
  );

  useEffect(() => {
    if (scrollViewRef.current === null || selectedActivityIds.length === 0) {
      return;
    }

    const ys = selectedActivityIds.map(
      (activityId) => activityTileSummaryYs.get(activityId) || Number.MAX_SAFE_INTEGER,
    );
    const scrollToActivityY = Math.min(...ys);

    scrollViewRef.current.scrollTo({ y: scrollToActivityY - 8, animated: true });
  }, [activityTileSummaryYs, selectedActivityIds]);

  return (
    <Wrapper colors={colors}>
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <ContentWrapper>
          {!sortedActivities && (
            <LoadingWrapper>
              <ActivityIndicator size="large" />
            </LoadingWrapper>
          )}
          {sortedActivities?.map((activity) => (
            <ActivityWrapper
              key={activity.id}
              isSelected={selectedActivityIds.includes(activity.id)}
              onLayout={(event: LayoutChangeEvent) => onLayout(activity.id, event)}
              onPress={() => goToActivityDetails(activity.id)}>
              <ActivitySummaryTileUI
                activity={activity}
                distanceMeasurementSystem={distanceMeasurementSystem}
                hasError={false}
              />
            </ActivityWrapper>
          ))}
          {sortedActivities?.length === 0 && (
            <NoActivityText>{i18n.t('summary.noActivities')}</NoActivityText>
          )}
        </ContentWrapper>
      </ScrollView>
    </Wrapper>
  );
};

export default SummaryActivityList;
