import React, { type FC } from 'react';

import { Circle, Line, Path, Svg } from 'react-native-svg';

import type { IconProps } from './types';
import theme from '../../theme/theme';

const RunningIcon: FC<IconProps> = ({ width = 34, height = 34, color = theme.colors.white }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Path
      d="M27,28h-8.1c-1.2,0-2.3-0.5-3.2-1.3L3,14l7-8v0c0,3.9,4.1,8,8,8h1v0c-0.1,4.5,1.6,7.8,6,9.2
	c0.3,0.1,0.5,0.2,0.8,0.2l0,0c1.2,0.3,2,1.6,1.7,2.8L27,28z"
    />
    <Path d="M1,16l13.7,13.7c0.8,0.8,2,1.3,3.2,1.3H27" />
    <Circle cx="10.5" cy="15.5" r="1.5" />
    <Line x1="15" y1="19" x2="19.5" y2="19" />
    <Line x1="17" y1="22" x2="22.5" y2="22" />
    <Path d="M28,1l-7.3,7.3C19,10,18.4,12.4,19,14.7l0,0" />
    <Path d="M10,7L10,7c1.9-0.6,3.6-2,4.6-3.7L16,1" />
  </Svg>
);

export default RunningIcon;
