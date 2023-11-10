import React, { type FC, useCallback, useState } from 'react';

import useActivities from '@api/activity/useActivities';
import usePreferences from '@api/preferences/usePreferences';

import HomeUI from '@components/home/HomeUI';

import { DistanceMeasurementSystem } from '@models/UnitSystem';

const App: FC = () => {
  const [page, setPage] = useState(0);

  const { data: activitiesData, isError, isLoading, isFetching, refetch } = useActivities(page);

  const { data: preferencesData } = usePreferences();

  const loadMore = useCallback(() => {
    if (isFetching || !activitiesData?.pages[activitiesData?.pages.length - 1].nextCursor) {
      return;
    }

    setPage((prevPage) => prevPage + 1);
  }, [activitiesData?.pages, isFetching]);

  return (
    <HomeUI
      data={activitiesData}
      isLoading={isFetching}
      initialLoading={isLoading && !activitiesData}
      hasError={isError}
      refreshing={false}
      distanceMeasurementSystem={preferencesData?.measurement || DistanceMeasurementSystem.METRIC}
      onEndReached={loadMore}
      onRefresh={refetch}
    />
  );
};

export default App;
