import { type FC } from 'react';

import { StatusBar } from 'expo-status-bar';

import OnboardingUI from '@components/auth/onboarding/OnboardingUI';

const OnboardingScreen: FC = () => (
  <>
    <StatusBar style="light" translucent />
    <OnboardingUI />
  </>
);

export default OnboardingScreen;
