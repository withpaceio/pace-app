import React, { type FC, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import useActivityMapSnapshot from '@api/activity/useActivityMapSnapshot';

import StaticMapImage from '@components/common/StaticMapImage';

import type { Activity } from '@models/Activity';

const Wrapper = styled.View<{ width: number; height: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: ${({ width }) => width}px;
  max-width: ${({ theme }) => theme.sizes.activityMapSnapshot.width}px;
  height: ${({ height }) => height}px;
  background-color: ${({ theme }) => theme.colors.darkComponentBackground};

  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
`;

type Props = {
  activity: Activity;
};

const ActivityMap: FC<Props> = ({ activity }) => {
  const theme = useTheme();

  const { data, isLoading, isError } = useActivityMapSnapshot({
    activityId: activity.id,
    activityEncryptionKey: activity.encryptionKey,
    mapSnapshotTheme: theme.dark ? 'dark' : 'light',
  });

  const { width: windowWidth } = useWindowDimensions();
  const imageWidth = useMemo(
    () =>
      Math.min(theme.sizes.activityMapSnapshot.width, windowWidth - 2 * theme.sizes.outerPadding),
    [theme.sizes.activityMapSnapshot.width, theme.sizes.outerPadding, windowWidth],
  );
  const imageHeight = useMemo(
    () =>
      imageWidth * (theme.sizes.activityMapSnapshot.height / theme.sizes.activityMapSnapshot.width),
    [imageWidth, theme],
  );

  return (
    <Wrapper width={imageWidth} height={imageHeight}>
      <StaticMapImage
        fetching={isLoading}
        error={isError}
        imageUri={data?.mapSnapshot}
        width={imageWidth}
        height={imageHeight}
      />
    </Wrapper>
  );
};

export default ActivityMap;
