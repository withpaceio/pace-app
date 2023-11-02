import { type SkPath, Skia } from '@shopify/react-native-skia';
import type { Line } from 'd3-shape';

import type { Histogram, Split } from '@activity';

export default function getSplitPaths(
  splits: Split[],
  splitBoundariesIndices: { startIndexHistogram: number; endIndexHistogram: number }[],
  maxSplitNumPoints: number,
  histogram: Histogram,
  pathLineGenerator: Line<{ x: number; y: number }>,
  pathLineNormalizer: Line<{ x: number; y: number }>,
): (SkPath | null)[] {
  return splits.map((_, index) => {
    const { startIndexHistogram, endIndexHistogram } = splitBoundariesIndices[index];

    const splitDataPoints = histogram.histogram
      .slice(startIndexHistogram, endIndexHistogram)
      .map((y) => ({ x: startIndexHistogram, y }));

    const svgPathString = pathLineGenerator(splitDataPoints);
    if (svgPathString === null) {
      return Skia.Path.Make();
    }

    const normalizedDataPoints = [];
    while (normalizedDataPoints.length < maxSplitNumPoints - splitDataPoints.length) {
      normalizedDataPoints.push({
        x: splitDataPoints.length + startIndexHistogram,
        y: splitDataPoints[splitDataPoints.length - 1].y,
      });
    }
    const extendedPathString = pathLineNormalizer(normalizedDataPoints)!;

    const splitPath = Skia.Path.MakeFromSVGString(svgPathString);
    if (extendedPathString !== null) {
      const extendedPath = Skia.Path.MakeFromSVGString(extendedPathString);
      splitPath?.addPath(extendedPath!);
    }

    return splitPath;
  });
}
