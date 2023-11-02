export default function convertPaceKmPerHourToMinutesPerKm(paceInKmPerHour: number): number {
  'worklet';
  if (paceInKmPerHour === 0) {
    return 0;
  }

  const rawPace = 60 / paceInKmPerHour;

  const paceMinutes = Math.trunc(rawPace);
  const remainder = rawPace - paceMinutes;
  const paceSeconds = remainder * 60;

  return paceMinutes + paceSeconds / 100;
}
