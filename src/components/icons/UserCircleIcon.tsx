import React, { FC } from 'react';

import { Circle, Path, Svg } from 'react-native-svg';

import theme from '../../theme/theme';
import { IconProps } from './types';

const UserCircleIcon: FC<IconProps> = ({ width = 34, height = 34, color = theme.colors.white }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
    <Circle cx="12" cy="10" r="3" />
    <Circle cx="12" cy="12" r="10" />
  </Svg>
);

export default UserCircleIcon;
