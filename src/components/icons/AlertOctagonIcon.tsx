import React, { type FC } from 'react';

import { Line, Polygon, Svg } from 'react-native-svg';

import type { IconProps } from './types';
import theme from '../../theme/theme';

const AlertOctagonIcon: FC<IconProps> = ({
  width = 34,
  height = 34,
  color = theme.colors.white,
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
    <Line x1="12" y1="8" x2="12" y2="12" />
    <Line x1="12" y1="16" x2="12.01" y2="16" />
  </Svg>
);

export default AlertOctagonIcon;
