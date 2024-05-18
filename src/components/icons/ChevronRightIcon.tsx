import React, { type FC } from 'react';

import { Path, Svg } from 'react-native-svg';

import theme from '../../theme/theme';
import { IconProps } from './types';

const ChevronRightIcon: FC<IconProps> = ({
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
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

export default ChevronRightIcon;
