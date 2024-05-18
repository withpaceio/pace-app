import React, { FC } from 'react';

import { Path, Svg } from 'react-native-svg';

import theme from '../../theme/theme';
import { IconProps } from './types';

const ShoppingBagIcon: FC<IconProps> = ({
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
    <Path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3.8 6h16.4M16 10a4 4 0 1 1-8 0" />
  </Svg>
);

export default ShoppingBagIcon;
