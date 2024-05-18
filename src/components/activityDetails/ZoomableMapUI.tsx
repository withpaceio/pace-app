import React, { type FC, useCallback } from 'react';

import { useRouter } from 'expo-router';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import ActivityMap from '@components/common/activity/ActivityMap';
import { CloseIcon } from '@components/icons';

import type { ActivityLocation } from '@models/Activity';

import { MAPTILER_URL_DARK, MAPTILER_URL_LIGHT } from '../../consts';

const ICON_SIZE = 30;

const Wrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const StyledActivityMap = styled(ActivityMap)`
  flex: 1;
`;

const CloseButtonWrapper = styled.TouchableOpacity<{ safeMarginTop: number }>`
  position: absolute;

  top: ${({ safeMarginTop, theme }) => safeMarginTop + theme.sizes.innerPadding}px;
  left: ${({ theme }) => theme.sizes.innerPadding}px;

  background-color: ${({ theme }) =>
    theme.dark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};

  padding: ${({ theme }) => theme.sizes.innerPadding}px;
  border-radius: 15px;
`;

type Props = {
  locations: ActivityLocation[] | undefined;
};

const ZoomableMap: FC<Props> = ({ locations }) => {
  const router = useRouter();
  const theme = useTheme();
  const { top: marginTop } = useSafeAreaInsets();

  const goToActivityDetails = useCallback((): void => {
    router.back();
  }, [router]);

  return (
    <Wrapper>
      <StyledActivityMap
        tileUrl={theme.dark ? MAPTILER_URL_DARK : MAPTILER_URL_LIGHT}
        locations={locations}
      />
      <CloseButtonWrapper safeMarginTop={marginTop} onPress={goToActivityDetails}>
        <CloseIcon width={ICON_SIZE} height={ICON_SIZE} />
      </CloseButtonWrapper>
    </Wrapper>
  );
};

export default ZoomableMap;
