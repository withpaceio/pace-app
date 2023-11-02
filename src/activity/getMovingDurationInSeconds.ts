import type { ActivityLocation } from '@models/Activity';

export default function getMovingDurationInSeconds(locations: ActivityLocation[]): number {
  let movingDuration = 0;

  for (let i = 0; i < locations.length - 1; i += 1) {
    const segmentIndex = locations[i].segment;
    let segmentDuration = 0;
    while (i < locations.length - 1 && locations[i + 1].segment === segmentIndex) {
      segmentDuration += locations[i + 1].timestamp - locations[i].timestamp;
      i += 1;
    }

    movingDuration += segmentDuration;
  }

  return movingDuration / 1000;
}
