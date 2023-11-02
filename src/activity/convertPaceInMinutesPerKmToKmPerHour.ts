export default function convertPaceInMinutesPerKmToKmPerHour(
  paceInMinutesPerKilometers: number,
): number {
  return 60 / paceInMinutesPerKilometers;
}
