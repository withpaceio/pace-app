import React, { type FC, type ReactNode, useEffect } from 'react';

import { useIsRestoring } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';

type Props = {
  children: ReactNode;
};

const AppLoader: FC<Props> = ({ children }) => {
  const isRestoring = useIsRestoring();

  useEffect(() => {
    if (isRestoring) {
      return;
    }

    SplashScreen.hideAsync();
  }, [isRestoring]);

  return <>{children}</>;
};

export default AppLoader;
