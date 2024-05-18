import React, { type FC } from 'react';

import { MAPTILER_URL_DARK } from '../../consts';
import SnapshotMap, { type Props } from './SnapshotMap';

const DarkMapSnapshot: FC<Omit<Props, 'tileUrl'>> = (props) => (
  <SnapshotMap tileUrl={MAPTILER_URL_DARK} {...props} />
);

export default DarkMapSnapshot;
