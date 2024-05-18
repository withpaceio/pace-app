import React, { FC } from 'react';

import { Circle, Svg } from 'react-native-svg';

import theme from '../../theme/theme';
import { IconProps } from './types';

const RecordIcon: FC<IconProps> = ({ width = 34, height = 34, color = theme.colors.white }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
);

export default RecordIcon;
