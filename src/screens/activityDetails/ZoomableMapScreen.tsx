import React, { FC } from 'react';

import { useRoute } from '@react-navigation/native';

import useActivity from '@api/activity/useActivity';
import useActivityLocations from '@api/activity/useActivityLocations';

import ZoomableMapUI from '@components/activityDetails/ZoomableMapUI';

import type { ActivityDetailsZoomableMapScreenProps } from '@navigation/types';

const ZoomableMapScreen: FC<ActivityDetailsZoomableMapScreenProps> = () => {
  const route = useRoute();
  // @ts-ignore
  const activityId = route?.params?.activityId;

  const { data: activityData } = useActivity(activityId);
  const { data: locationsData } = useActivityLocations({
    activityId,
    activityEncryptionKey: activityData?.encryptionKey,
  });

  return <ZoomableMapUI activityId={activityId} locations={locationsData?.locations} />;
};

export default ZoomableMapScreen;
