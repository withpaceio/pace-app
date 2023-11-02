export default function convertPaceInMinutesPerMiles(paceInMinutesPerKilometers: number): number {
  const paceInMinutesPerMiles = paceInMinutesPerKilometers * 1.60934;

  const paceMinutes = Math.trunc(paceInMinutesPerMiles);
  const remainder = paceInMinutesPerMiles - paceMinutes;
  const paceSeconds = remainder * 60;

  return paceMinutes + paceSeconds / 100;
}
