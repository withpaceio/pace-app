import React, { FC } from 'react';

import { Path, Svg } from 'react-native-svg';

import theme from '../../theme/theme';
import { IconProps } from './types';

const RotateLeftIcon: FC<IconProps> = ({ width = 34, height = 34, color = theme.colors.white }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38" />
  </Svg>
);

export default RotateLeftIcon;
