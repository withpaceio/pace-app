import { useColorScheme } from 'react-native';

import type { DefaultTheme } from 'styled-components/native';

import darkTheme from './darkTheme';
import theme from './theme';

export default function useTheme(): DefaultTheme {
  const colorScheme = useColorScheme();

  switch (colorScheme) {
    case 'dark':
      return darkTheme;
    default:
      return theme;
  }
}
