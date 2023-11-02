import type { Histogram, Split } from '@activity';

import type { ActivityLocationDistance } from '@models/Activity';

export default function getStartEndIndices(
  splits: Split[],
  rawData: ActivityLocationDistance[],
  histogram: Histogram,
): {
  indices: { startIndexHistogram: number; endIndexHistogram: number }[];
  maxSplitNumPoints: number;
} {
  const indices = splits.map(({ startIndex, endIndex }) => {
    const normalizedStartIndex = startIndex >= 0 ? startIndex : -startIndex + 1;
    const normalizedEndIndex = endIndex >= 0 ? endIndex : -endIndex + 2;

    const startIndexHistogram = Math.floor(
      (normalizedStartIndex / rawData.length) * histogram.histogram.length,
    );
    const endIndexHistogram = Math.ceil(
      (normalizedEndIndex / rawData.length) * histogram.histogram.length,
    );

    return { startIndexHistogram, endIndexHistogram };
  });

  const maxSplitNumPoints = Math.max(
    ...indices.map(
      ({ startIndexHistogram, endIndexHistogram }) => endIndexHistogram - startIndexHistogram,
    ),
  );

  return { indices, maxSplitNumPoints };
}
