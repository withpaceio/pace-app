import React, { type FC } from 'react';

import { Polygon, Svg } from 'react-native-svg';

import type { IconProps } from './types';
import theme from '../../theme/theme';

const EditIcon: FC<IconProps> = ({ width = 34, height = 34, color = theme.colors.white }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Polygon points="16 3 21 8 8 21 3 21 3 16 16 3" />
  </Svg>
);

export default EditIcon;
