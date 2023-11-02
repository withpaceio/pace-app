import React, { FC } from 'react';

import { Circle, Path, Rect, Svg } from 'react-native-svg';

import { IconProps } from './types';
import theme from '../../theme/theme';

const ImageIcon: FC<IconProps> = ({ width = 34, height = 34, color = theme.colors.white }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Rect x="3" y="3" width="18" height="18" rx="2" />
    <Circle cx="8.5" cy="8.5" r="1.5" />
    <Path d="M20.4 14.5L16 10 4 20" />
  </Svg>
);

export default ImageIcon;
