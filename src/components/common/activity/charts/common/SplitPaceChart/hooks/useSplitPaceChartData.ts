import { useMemo } from 'react';

import { type Split, getSplits } from '@activity';
import { useTheme } from '@theme';

import { type ActivityLocation, ActivityType } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import useScaleLinear, { type Scale } from '../../PaceChart/hooks/useScaleLinear';

type Args = {
  activityType: ActivityType;
  chartWidth: number;
  splitLengthInMeters: number;
  locations: ActivityLocation[];
  distanceMeasurementSystem: DistanceMeasurementSystem;
};

export default function useSplitPaceChartData({
  activityType,
  chartWidth,
  splitLengthInMeters,
  locations,
  distanceMeasurementSystem,
}: Args): { splits: Split[]; paceScale: Scale } {
  const {
    sizes: {
      innerPadding,
      outerPadding,
      splitChart: { splitValueWidth },
    },
  } = useTheme();

  const { splits, minSplitPace, maxSplitPace } = useMemo(() => {
    const currentSplits = getSplits(
      activityType,
      locations,
      distanceMeasurementSystem,
      splitLengthInMeters,
    );
    const splitsPace = currentSplits.map(({ pace }) => pace);

    const minPace = Math.min(...splitsPace);
    const maxPace = Math.max(...splitsPace);

    return { splits: currentSplits, minSplitPace: minPace, maxSplitPace: maxPace };
  }, [activityType, distanceMeasurementSystem, locations, splitLengthInMeters]);

  const xScale = useScaleLinear(
    [0, chartWidth - (3 * splitValueWidth + innerPadding + outerPadding)],
    activityType === ActivityType.RUNNING
      ? [maxSplitPace, minSplitPace - minSplitPace * 0.05]
      : [minSplitPace, maxSplitPace + maxSplitPace * 0.05],
  );

  return {
    splits,
    paceScale: xScale,
  };
}
