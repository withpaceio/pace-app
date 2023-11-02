import React, { FC } from 'react';

import { PlayIcon } from '@components/icons';

import ActionButton from './ActionButton';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

const GoButton: FC<Props> = ({ onPress, disabled }) => (
  <ActionButton Icon={<PlayIcon />} onPress={onPress} disabled={disabled} />
);

export default GoButton;
