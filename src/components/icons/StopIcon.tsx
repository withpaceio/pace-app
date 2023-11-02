import React, { type FC } from 'react';

import { Rect, Svg } from 'react-native-svg';

import { IconProps } from './types';
import theme from '../../theme/theme';

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
    <Rect x="5" y="5" width="12" height="12" fill={color} />
  </Svg>
);

export default StopIcon;
