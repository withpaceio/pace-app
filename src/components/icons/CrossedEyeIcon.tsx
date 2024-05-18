import React, { type FC } from 'react';

import { Circle, Line, Path, Svg } from 'react-native-svg';

import theme from '../../theme/theme';
import type { IconProps } from './types';

const CrossedEyeIcon: FC<IconProps> = ({ width = 34, height = 34, color = theme.colors.white }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Circle cx="12" cy="12" r="3" />
    <Line x1={22} y1={2} x2={2} y2={22} />
  </Svg>
);

export default CrossedEyeIcon;
