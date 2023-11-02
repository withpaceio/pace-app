import React, { FC } from 'react';

import { Circle, G, Path, Svg } from 'react-native-svg';

import { IconProps } from './types';
import theme from '../../theme/theme';

const CameraIcon: FC<IconProps> = ({ width = 34, height = 34, color = theme.colors.white }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <G transform="translate(2 3)">
      <Path d="M20 16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v11z" />
      <Circle cx="10" cy="10" r="4" />
    </G>
  </Svg>
);

export default CameraIcon;
