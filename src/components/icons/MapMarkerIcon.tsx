import React, { type FC } from 'react';

import { Circle, Path, Svg } from 'react-native-svg';

import type { IconProps } from './types';
import theme from '../../theme/theme';

const MapMarkerIcon: FC<IconProps> = ({
  width = 34,
  height = 34,
  color = theme.colors.white,
  backgroundColor = theme.colors.purple,
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
    <Path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" fill={color} />
    <Circle cx="12" cy="10" r="3" fill={backgroundColor} stroke={backgroundColor} />
  </Svg>
);

export default MapMarkerIcon;
