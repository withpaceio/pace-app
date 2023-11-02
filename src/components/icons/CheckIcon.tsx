import React, { type FC } from 'react';

import { Polyline, Svg } from 'react-native-svg';

import type { IconProps } from './types';
import theme from '../../theme/theme';

const CheckIcon: FC<IconProps> = ({
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
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

export default CheckIcon;
