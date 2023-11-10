import { type FC, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { CloseIcon, PaceIcon } from '@components/icons';

import LandingUI from './LandingUI';
import Policies from './Policies';
import SignInUI from '../SignInUI';
import SignUpUI from '../SignUpUI';

const HEADER_HEIGHT = 300;
const COLLAPSED_HEADER_HEIGHT = 100;

const PACE_ICON_SIZE = 80;

const ANIMATION_DURATION = 500;

const Wrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderGradientWrapper = styled(LinearGradient)`
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const BackArrowWrapper = styled.Pressable<{ safeMarginTop: number }>`
  position: absolute;
  top: ${({ theme }) => theme.sizes.innerPadding + COLLAPSED_HEADER_HEIGHT}px;
  left: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const PaceText = styled(Animated.Text)`
  width: 100%;

  font-family: 'Roboto-BlackItalic';
  font-size: 70px;
  letter-spacing: -8px;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};

  margin-top: ${({ theme }) => 5 * theme.sizes.outerPadding}px;
`;

const IconWrapper = styled(Animated.View)`
  position: absolute;
  top: ${HEADER_HEIGHT - 60}px;
  align-self: center;

  padding: ${({ theme }) => theme.sizes.outerPadding}px;
  border-radius: 20px;

  background-color: ${({ theme }) => theme.colors.black};

  shadow-color: ${({ theme }) => theme.colors.blackPurple};
  shadow-opacity: 1;
  shadow-offset: 0px 10px;
  shadow-radius: 20px;
  elevation: 5;
`;

const OnboardingUI: FC = () => {
  const [step, setStep] = useState<'landing' | 'signUp' | 'signIn'>('landing');
  const [loading, setLoading] = useState(false);

  const headerHeight = useSharedValue(HEADER_HEIGHT);
  const headerStyle = useAnimatedStyle(() => ({
    zIndex: 2,
    height: withTiming(headerHeight.value, { duration: ANIMATION_DURATION }),
  }));

  const paceTextOpacity = useSharedValue(1);
  const paceTextScale = useSharedValue(1);
  const paceTextStyle = useAnimatedStyle(() => ({
    opacity: withTiming(paceTextOpacity.value, { duration: ANIMATION_DURATION }),
    transform: [{ scale: withTiming(paceTextScale.value, { duration: ANIMATION_DURATION }) }],
  }));

  const paceIconTranslateY = useSharedValue(0);
  const paceIconScale = useSharedValue(1);
  const paceIconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(paceIconTranslateY.value, { duration: ANIMATION_DURATION }) },
      { scale: withTiming(paceIconScale.value, { duration: ANIMATION_DURATION }) },
    ],
  }));

  const backIconOpacity = useSharedValue(0);
  const backIconStyle = useAnimatedStyle(() => ({
    opacity: withTiming(backIconOpacity.value, { duration: ANIMATION_DURATION }),
  }));

  const { top: safeMarginTop } = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Wrapper>
        <Animated.View style={headerStyle}>
          <HeaderGradientWrapper
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={[theme.colors.black, theme.colors.blackPurple]}>
            <PaceText style={paceTextStyle}>PACE</PaceText>
          </HeaderGradientWrapper>
          <IconWrapper style={paceIconStyle}>
            <PaceIcon width={PACE_ICON_SIZE} height={PACE_ICON_SIZE} />
          </IconWrapper>
        </Animated.View>
        <Animated.ScrollView
          contentContainerStyle={{
            marginLeft: theme.sizes.outerPadding,
            marginRight: theme.sizes.outerPadding,
          }}>
          {step === 'landing' && (
            <LandingUI
              onCreateAccountPress={() => {
                headerHeight.value = COLLAPSED_HEADER_HEIGHT;
                paceTextOpacity.value = 0;
                paceTextScale.value = 0;
                paceIconTranslateY.value = -200;
                paceIconScale.value = 0.5;
                backIconOpacity.value = 1;
                setStep('signUp');
              }}
              onSignInPress={() => {
                headerHeight.value = COLLAPSED_HEADER_HEIGHT;
                paceTextOpacity.value = 0;
                paceTextScale.value = 0;
                paceIconTranslateY.value = -200;
                paceIconScale.value = 0.5;
                backIconOpacity.value = 1;
                setStep('signIn');
              }}
            />
          )}
          {step === 'signIn' && <SignInUI onLoadingChanged={setLoading} />}
          {step === 'signUp' && <SignUpUI onLoadingChanged={setLoading} />}
        </Animated.ScrollView>
        {step !== 'landing' && !loading && (
          <BackArrowWrapper
            safeMarginTop={safeMarginTop}
            onPress={() => {
              headerHeight.value = HEADER_HEIGHT;
              paceTextOpacity.value = 1;
              paceTextScale.value = 1;
              paceIconTranslateY.value = 0;
              paceIconScale.value = 1;
              backIconOpacity.value = 0;
              setStep('landing');
            }}>
            <Animated.View style={backIconStyle}>
              <CloseIcon color={theme.colors.primary} width={30} height={30} />
            </Animated.View>
          </BackArrowWrapper>
        )}
        <Policies />
      </Wrapper>
    </TouchableWithoutFeedback>
  );
};

export default OnboardingUI;
