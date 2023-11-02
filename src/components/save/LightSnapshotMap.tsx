import React, { type FC } from 'react';

import SnapshotMap, { type Props } from './SnapshotMap';
import { MAPTILER_URL_LIGHT } from '../../consts';

const LightMapSnapshot: FC<Omit<Props, 'tileUrl'>> = (props) => (
  <SnapshotMap tileUrl={MAPTILER_URL_LIGHT} {...props} />
);

export default LightMapSnapshot;
