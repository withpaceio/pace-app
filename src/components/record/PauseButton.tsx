import React, { type FC } from 'react';

import { PauseIcon } from '@components/icons';

import ActionButton from './ActionButton';

type Props = {
  onPress: () => void;
};

const PauseButton: FC<Props> = ({ onPress }) => (
  <ActionButton Icon={<PauseIcon />} onPress={onPress} />
);

export default PauseButton;
