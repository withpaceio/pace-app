import { type FC } from 'react';

import { useLocalSearchParams } from 'expo-router';

import useActivity from '@api/activity/useActivity';
import useActivityLocations from '@api/activity/useActivityLocations';

import ZoomableMapUI from '@components/activityDetails/ZoomableMapUI';

const ZoomableMapScreen: FC = () => {
  const { id: activityId } = useLocalSearchParams<{ id?: string }>();

  const { data: activityData } = useActivity(activityId);
  const { data: locationsData } = useActivityLocations({
    activityId,
    activityEncryptionKey: activityData?.encryptionKey,
  });

  return <ZoomableMapUI locations={locationsData?.locations} />;
};

export default ZoomableMapScreen;
