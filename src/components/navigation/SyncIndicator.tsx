import React, { type FC, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

import { onlineManager, useIsMutating } from '@tanstack/react-query';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { UploadIcon } from '@components/icons';

const Wrapper = styled(Animated.View)`
  position: absolute;
  right: 0;
`;

const SyncIndicator: FC = () => {
  const animatedOpacityRef = useRef(new Animated.Value(1));
  const animationRef = useRef(
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedOpacityRef.current, {
          toValue: 0.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedOpacityRef.current, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ),
  );

  const isMutating = useIsMutating();
  const theme = useTheme();

  const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

  useEffect(() => {
    const unsubscribe = onlineManager.subscribe((online) => {
      setIsOnline(online);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isMutating && isOnline) {
      animationRef.current.start();
    } else {
      animationRef.current.stop();
      animationRef.current.reset();
    }
  }, [isOnline, isMutating]);

  if (!isMutating || !isOnline) {
    return null;
  }

  return (
    <Wrapper style={{ opacity: animatedOpacityRef.current }}>
      <UploadIcon color={theme.colors.green} />
    </Wrapper>
  );
};

export default SyncIndicator;
