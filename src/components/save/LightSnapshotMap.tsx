import React, { type FC } from 'react';

import { MAPTILER_URL_LIGHT } from '../../consts';
import SnapshotMap, { type Props } from './SnapshotMap';

const LightMapSnapshot: FC<Omit<Props, 'tileUrl'>> = (props) => (
  <SnapshotMap tileUrl={MAPTILER_URL_LIGHT} {...props} />
);

export default LightMapSnapshot;
