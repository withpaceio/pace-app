import 'react-native-get-random-values';

import React, { type FC, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, AppState, type AppStateStatus, Platform } from 'react-native';

import MapLibreGL from '@maplibre/maplibre-react-native';
import NetInfo from '@react-native-community/netinfo';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { focusManager, onlineManager } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Purchases from 'react-native-purchases';
import styled, { ThemeProvider } from 'styled-components/native';

import { AuthProvider } from '@auth';
import { useTheme } from '@theme';

import AppLoader from '@components/AppLoader';
import QueryClientProvider from '@components/QueryClientProvider';

import MainNavigator from '@navigation/MainNavigator';
import loadFonts from '@utils/loadFonts';

import { REVENUE_CAT_API_KEY_ANDROID, REVENUE_CAT_API_KEY_IOS } from './consts';

MapLibreGL.setAccessToken(null);

SplashScreen.preventAutoHideAsync();

const RootWrapper = styled(GestureHandlerRootView)`
  flex: 1;
`;

const ActivityIndicatorWrapper = styled.View<{ backgroundColor: string }>`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const App: FC = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [navigationTheme, setNavigationTheme] = useState(DefaultTheme);

  const theme = useTheme();

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

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setNavigationTheme(theme.dark ? DarkTheme : DefaultTheme);
  }, [theme]);

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
    const listener = NetInfo.addEventListener((state) => {
      onlineManager.setOnline(
        state.isConnected !== null && state.isConnected && Boolean(state.isInternetReachable),
      );
    });

    return () => {
      listener();
    };
  }, []);

  if (!fontLoaded) {
    return (
      <ActivityIndicatorWrapper backgroundColor={theme.colors.background}>
        <ActivityIndicator />
      </ActivityIndicatorWrapper>
    );
  }

  return (
    <RootWrapper>
      <ThemeProvider theme={theme}>
        <NavigationContainer theme={navigationTheme}>
          <AuthProvider>
            <QueryClientProvider>
              <AppLoader>
                <MainNavigator />
              </AppLoader>
            </QueryClientProvider>
          </AuthProvider>
        </NavigationContainer>
      </ThemeProvider>
    </RootWrapper>
  );
};

export default App;
