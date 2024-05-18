import { type FC, useCallback, useEffect, useState } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';

import { Slot, SplashScreen } from 'expo-router';

import MapLibreGL from '@maplibre/maplibre-react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { focusManager, onlineManager, useIsRestoring } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import Purchases from 'react-native-purchases';
import styled, { ThemeProvider } from 'styled-components/native';

import { AuthProvider } from '@auth';
import { useTheme } from '@theme';

import QueryClientProvider from '@components/QueryClientProvider';

import loadFonts from '@utils/loadFonts';

import { REVENUE_CAT_API_KEY_ANDROID, REVENUE_CAT_API_KEY_IOS } from '../consts';

MapLibreGL.setAccessToken(null);

SplashScreen.preventAutoHideAsync();

const RootWrapper = styled(GestureHandlerRootView)`
  flex: 1;
`;

const RootLayout: FC = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  const theme = useTheme();
  const isRestoring = useIsRestoring();

  const load = useCallback(async () => {
    await loadFonts();
    setFontLoaded(true);
  }, []);

  const loadPurchases = useCallback((): void => {
    Purchases.setLogLevel(__DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.INFO);
    Purchases.configure({
      apiKey: Platform.OS === 'ios' ? REVENUE_CAT_API_KEY_IOS : REVENUE_CAT_API_KEY_ANDROID,
    });
  }, []);

  const onLayoutRootView = useCallback(async (): Promise<void> => {
    if (!fontLoaded || isRestoring) {
      return;
    }

    await SplashScreen.hideAsync();
  }, [fontLoaded, isRestoring]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  useEffect(() => {
    const listener = AppState.addEventListener('change', (status: AppStateStatus) => {
      focusManager.setFocused(status === 'active');
    });

    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      onlineManager.setOnline(
        state.isConnected !== null && state.isConnected && Boolean(state.isInternetReachable),
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!fontLoaded || isRestoring) {
    return null;
  }

  return (
    <RootWrapper onLayout={onLayoutRootView}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <QueryClientProvider>
            <NavigationThemeProvider value={theme.dark ? DarkTheme : DefaultTheme}>
              <Slot />
            </NavigationThemeProvider>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </RootWrapper>
  );
};

export default RootLayout;
