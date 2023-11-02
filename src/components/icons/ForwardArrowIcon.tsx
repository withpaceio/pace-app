import React, { FC } from 'react';

import { Path, Svg } from 'react-native-svg';

import { IconProps } from './types';
import theme from '../../theme/theme';

const ForwardArrowIcon: FC<IconProps> = ({
  width = 34,
  height = 34,
  color = theme.colors.white,
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
    <Path d="M5 12h13M12 5l7 7-7 7" />
  </Svg>
);

export default ForwardArrowIcon;
