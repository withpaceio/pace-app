import React, { type FC } from 'react';

import { Line, Svg } from 'react-native-svg';

import type { IconProps } from './types';
import theme from '../../theme/theme';

const CloseIcon: FC<IconProps> = ({
  width = 34,
  height = 34,
  color = theme.colors.white,
  strokeWidth = 1.5,
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round">
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

export default CloseIcon;
