import React, { FC } from 'react';

import { Circle, Path, Svg } from 'react-native-svg';

import { IconProps } from './types';
import theme from '../../theme/theme';

const AtIcon: FC<IconProps> = ({ width = 34, height = 34, color = theme.colors.white }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Circle cx="12" cy="12" r="4" />
    <Path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
  </Svg>
);
export default AtIcon;
