import React, { type FC, useMemo } from 'react';
import { Animated } from 'react-native';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { MaximizeIcon, WarningIcon } from '@components/icons';
import { ActivityIndicator, Text } from '@components/ui';

import i18n from '@translations/i18n';

import { CONTRIBUTORS_COPYRIGHT } from '../../consts';

const ICON_SIZE = 30;

const FetchingAndErrorWrapper = styled.View<{ height: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: ${({ height }) => height}px;

  background-color: ${({ theme }) => theme.colors.darkComponentBackground};
`;

const TextError = styled(Text)`
  color: ${({ theme }) => theme.colors.red};
  font-size: 16px;
  font-weight: bold;

  margin-top: 5px;
`;

const FooterWrapper = styled(Animated.View)`
  width: 100%;
`;

const AttributionsText = styled(Text)`
  align-self: flex-end;

  background-color: ${({ theme }) => theme.colors.componentBackground};
  opacity: 0.4;

  color: ${({ theme }) => theme.colors.primary};
  font-size: 11px;

  margin-top: -14px;
  padding-horizontal: 4px;
`;

const FullScreenWrapper = styled.TouchableOpacity`
  position: absolute;

  right: ${({ theme }) => theme.sizes.innerPadding}px;
  bottom: ${({ theme }) => theme.sizes.outerPadding}px;

  background-color: ${({ theme }) =>
    theme.dark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};

  padding: ${({ theme }) => theme.sizes.innerPadding}px;
  border-radius: 15px;
`;

type Props = {
  imageUri: string | undefined | null;
  fetching: boolean;
  error: boolean;
  top?: Animated.Value | Animated.AnimatedInterpolation<number> | number;
  bottom?: Animated.Value | Animated.AnimatedInterpolation<number> | number;
  width: Animated.Value | Animated.AnimatedInterpolation<number> | number;
  height: number;
  onPress?: () => void;
};

const StaticMapImage: FC<Props> = ({
  imageUri,
  fetching,
  error,
  top,
  bottom,
  width,
  height,
  onPress,
}) => {
  const theme = useTheme();

  const { imageAnimatedTop, imageAnimatedScale, textAnimatedTop } = useMemo(() => {
    if (!top) {
      return { imageAnimatedTop: 0, imageAnimatedScale: 1, textAnimatedTop: 0 };
    }

    if (typeof top === 'number') {
      return { imageAnimatedTop: top, imageAnimatedScale: top, textAnimatedTop: top };
    }

    return {
      imageAnimatedTop: top.interpolate({
        inputRange: [-height, 0, height],
        outputRange: [-height / 2, 0, height],
      }),
      imageAnimatedScale: top.interpolate({
        inputRange: [-height, 0, height],
        outputRange: [2, 1, 1],
      }),
      textAnimatedTop: top.interpolate({
        inputRange: [-height, 0, height],
        outputRange: [0, 0, height],
      }),
    };
  }, [height, top]);

  return (
    <>
      <Animated.View
        style={{
          transform: [{ translateY: imageAnimatedTop }, { scale: imageAnimatedScale }],
        }}>
        {imageUri ? (
          <Animated.Image
            style={{ width, height, bottom }}
            resizeMode="cover"
            source={{ uri: imageUri }}
          />
        ) : (
          <FetchingAndErrorWrapper height={height}>
            {fetching && !error && <ActivityIndicator />}
            {!fetching && error && (
              <>
                <WarningIcon color={theme.colors.red} />
                <TextError>{i18n.t('activityDetails.errors.mapSnapshot')}</TextError>
              </>
            )}
          </FetchingAndErrorWrapper>
        )}
      </Animated.View>
      {imageUri && (
        <FooterWrapper style={{ transform: [{ translateY: textAnimatedTop }] }}>
          <AttributionsText>{CONTRIBUTORS_COPYRIGHT}</AttributionsText>
          {onPress && (
            <FullScreenWrapper onPress={onPress}>
              <MaximizeIcon
                width={ICON_SIZE}
                height={ICON_SIZE}
                color={theme.dark ? theme.colors.white : theme.colors.black}
              />
            </FullScreenWrapper>
          )}
        </FooterWrapper>
      )}
    </>
  );
};

export default StaticMapImage;
