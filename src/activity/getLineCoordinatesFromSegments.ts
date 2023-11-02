import type { ActivityLocation } from '@models/Activity';

export default function getLineCoordinatesFromSegments(locations: ActivityLocation[]): {
  segmentsCoordinates: number[][][];
  inBetweenSegmentsCoordinates: number[][][];
} {
  const allSegmentsCoordinates: number[][][] = [];
  const inBetweenSegmentsCoordinates: number[][][] = [];

  for (let i = 0; i < locations.length; i += 1) {
    const segmentCoordinates = [];
    const segmentIndex = locations[i].segment;
    while (i < locations.length - 1 && locations[i].segment === segmentIndex) {
      const { longitude, latitude } = locations[i];
      segmentCoordinates.push([longitude, latitude]);
      i += 1;
    }

    allSegmentsCoordinates.push(segmentCoordinates);

    if (i === locations.length - 1) {
      continue;
    }

    const endPointCurrentSegment = locations[i - 1];
    const startPointNextSegment = locations[i];
    inBetweenSegmentsCoordinates.push([
      [endPointCurrentSegment.longitude, endPointCurrentSegment.latitude],
      [startPointNextSegment.longitude, startPointNextSegment.latitude],
    ]);
  }

  return { segmentsCoordinates: allSegmentsCoordinates, inBetweenSegmentsCoordinates };
}
