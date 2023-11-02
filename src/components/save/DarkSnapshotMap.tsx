import React, { type FC } from 'react';

import SnapshotMap, { type Props } from './SnapshotMap';
import { MAPTILER_URL_DARK } from '../../consts';

const DarkMapSnapshot: FC<Omit<Props, 'tileUrl'>> = (props) => (
  <SnapshotMap tileUrl={MAPTILER_URL_DARK} {...props} />
);

export default DarkMapSnapshot;
