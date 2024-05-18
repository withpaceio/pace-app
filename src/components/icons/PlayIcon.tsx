import React, { FC } from 'react';

import { Polygon, Svg } from 'react-native-svg';

import theme from '../../theme/theme';
import { IconProps } from './types';

const PlayIcon: FC<IconProps> = ({ width = 34, height = 34, color = theme.colors.white }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Polygon points="5 3 19 12 5 21 5 3" fill={color} />
  </Svg>
);

export default PlayIcon;
