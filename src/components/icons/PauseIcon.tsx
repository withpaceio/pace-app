import React, { type FC } from 'react';

import { Rect, Svg } from 'react-native-svg';

import theme from '../../theme/theme';
import { IconProps } from './types';

const StopIcon: FC<IconProps> = ({ width = 34, height = 34, color = theme.colors.white }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Rect x="6" y="4" width="4" height="16" fill={color} />
    <Rect x="14" y="4" width="4" height="16" fill={color} />
  </Svg>
);

export default StopIcon;
