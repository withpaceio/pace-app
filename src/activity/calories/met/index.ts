import type { ActivityType } from '@models/Activity';

import cycling from './cycling';
import running from './running';

const metValues: Record<ActivityType, { pace: number; met: number }[]> = {
  CYCLING: cycling,
  RUNNING: running,
};

export default metValues;
