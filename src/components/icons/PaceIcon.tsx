import React, { FC } from 'react';

import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

import { IconProps } from './types';
import theme from '../../theme/theme';

const PaceIcon: FC<IconProps> = ({ width = 73, height = 50 }) => (
  <Svg width={width} height={height} viewBox="0 0 346 215" fill="none">
    <Path
      d="M11.0666 102.744C15.4068 90.941 26.6477 83.0977 39.2233 83.0977H315.684C319.091 83.0977 321.5 86.4309 320.432 89.6661L313.273 111.336C309.213 123.626 297.729 131.926 284.787 131.926H7.50187C4.02441 131.926 1.60892 128.464 2.80907 125.2L11.0666 102.744Z"
      fill="url(#paint0_linear)"
    />
    <Path
      d="M158.829 21.6952C162.721 9.13791 174.337 0.578125 187.483 0.578125H338.798C342.157 0.578125 344.561 3.82402 343.581 7.03679L337.139 28.1582C333.289 40.7816 321.641 49.4062 308.444 49.4062H157.023C153.655 49.4062 151.25 46.1431 152.247 42.9258L158.829 21.6952Z"
      fill="url(#paint1_linear)"
    />
    <Path
      d="M32.0535 184.356C36.6407 173.029 47.6395 165.617 59.8596 165.617H286.257C289.702 165.617 292.114 169.018 290.977 172.269L283.246 194.356C279.035 206.388 267.679 214.445 254.93 214.445H27.2867C23.7402 214.445 21.321 210.856 22.6523 207.568L32.0535 184.356Z"
      fill="url(#paint2_linear)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear"
        x1="0.180018"
        y1="132.128"
        x2="306.635"
        y2="132.128"
        gradientUnits="userSpaceOnUse">
        <Stop stopColor={theme.colors.purple} />
        <Stop offset="1" stopColor={theme.colors.green} />
      </LinearGradient>
      <LinearGradient
        id="paint1_linear"
        x1="150.144"
        y1="49.6088"
        x2="335.874"
        y2="49.6088"
        gradientUnits="userSpaceOnUse">
        <Stop stopColor={theme.colors.purple} />
        <Stop offset="1" stopColor={theme.colors.green} />
      </LinearGradient>
      <LinearGradient
        id="paint2_linear"
        x1="19.7349"
        y1="214.648"
        x2="279.758"
        y2="214.648"
        gradientUnits="userSpaceOnUse">
        <Stop stopColor={theme.colors.purple} />
        <Stop offset="1" stopColor={theme.colors.green} />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default PaceIcon;
