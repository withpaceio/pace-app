import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';

import { ActivityType } from '@models/Activity';

import Screens from './screens';

export type AuthStackParamList = {
  [Screens.ONBOARDING]: undefined;
  [Screens.SIGN_IN]: undefined;
  [Screens.SIGN_UP]: undefined;
};

export type HomeStackParamList = {
  [Screens.HOME_TABS_NAVIGATOR]: NavigatorScreenParams<HomeTabsParamList>;
  [Screens.ACTIVITY_DETAILS]: { activityId: string };
  [Screens.ACTIVITY_DETAILS_ZOOMABLE_MAP]: { activityId: string };
  [Screens.EDIT_ACTIVITY]: { activityId: string };
  [Screens.SAVE]: { activityType: ActivityType };
  [Screens.SETTINGS]: undefined;
  [Screens.WEEKLY_SUMMARY]: undefined;
  [Screens.MONTHLY_SUMMARY]: undefined;
};

export type HomeTabsParamList = {
  [Screens.ACCOUNT]: undefined;
  [Screens.HOME]: undefined;
  [Screens.RECORD]: undefined;
};

export type MainStackParamList = {
  [Screens.AUTH_NAVIGATOR]: NavigatorScreenParams<AuthStackParamList>;
  [Screens.CHANGE_DEFAULT_ACTIVTY_TYPE]: undefined;
  [Screens.CHANGE_DISPLAY_PREFERENCES]: undefined;
  [Screens.PAYWALL]: undefined;
  [Screens.CHANGE_PASSWORD]: undefined;
  [Screens.CHOOSE_PROFILE_PICTURE]: undefined;
  [Screens.CONFIGURE_HEALTH_INFORMATION]: undefined;
  [Screens.CONFIGURE_RECOVERY_EMAIL]: { recoveryEmail?: string };
  [Screens.HOME_NAVIGATOR]: NavigatorScreenParams<HomeStackParamList>;
};

export type AuthNavigatorScreenProps = StackScreenProps<MainStackParamList, Screens.AUTH_NAVIGATOR>;
export type OnboardingScreenProps = CompositeScreenProps<
  AuthNavigatorScreenProps,
  StackScreenProps<AuthStackParamList, Screens.ONBOARDING>
>;
export type SignInScreenProps = CompositeScreenProps<
  AuthNavigatorScreenProps,
  StackScreenProps<AuthStackParamList, Screens.SIGN_IN>
>;
export type SignUpScreenProps = CompositeScreenProps<
  AuthNavigatorScreenProps,
  StackScreenProps<AuthStackParamList, Screens.SIGN_UP>
>;

export type HomeNavigatorScreenProps = StackScreenProps<MainStackParamList, Screens.HOME_NAVIGATOR>;
export type HomeTabsScreenProps = CompositeScreenProps<
  HomeNavigatorScreenProps,
  StackScreenProps<HomeStackParamList, Screens.HOME_TABS_NAVIGATOR>
>;
export type ActivityDetailsScreenProps = CompositeScreenProps<
  HomeNavigatorScreenProps,
  StackScreenProps<HomeStackParamList, Screens.ACTIVITY_DETAILS>
>;
export type ActivityDetailsZoomableMapScreenProps = CompositeScreenProps<
  HomeNavigatorScreenProps,
  StackScreenProps<HomeStackParamList, Screens.ACTIVITY_DETAILS_ZOOMABLE_MAP>
>;
export type EditActivityScreenProps = CompositeScreenProps<
  HomeNavigatorScreenProps,
  StackScreenProps<HomeStackParamList, Screens.EDIT_ACTIVITY>
>;

export type SaveScreenProps = CompositeScreenProps<
  HomeNavigatorScreenProps,
  StackScreenProps<HomeStackParamList, Screens.SAVE>
>;
export type SettingsScreenProps = CompositeScreenProps<
  HomeNavigatorScreenProps,
  StackScreenProps<HomeStackParamList, Screens.SETTINGS>
>;
export type WeeklySummaryScreenProps = CompositeScreenProps<
  HomeNavigatorScreenProps,
  StackScreenProps<HomeStackParamList, Screens.WEEKLY_SUMMARY>
>;
export type MonthlySummaryScreenProps = CompositeScreenProps<
  HomeNavigatorScreenProps,
  StackScreenProps<HomeStackParamList, Screens.MONTHLY_SUMMARY>
>;

export type AccountScreenProps = CompositeScreenProps<
  HomeTabsScreenProps,
  BottomTabScreenProps<HomeTabsParamList, Screens.ACCOUNT>
>;
export type HomeScreenProps = CompositeScreenProps<
  HomeTabsScreenProps,
  BottomTabScreenProps<HomeTabsParamList, Screens.HOME>
>;
export type RecordScreenProps = CompositeScreenProps<
  HomeTabsScreenProps,
  BottomTabScreenProps<HomeTabsParamList, Screens.RECORD>
>;

export type ChangeDefaultActivityTypeScreenProps = StackScreenProps<
  MainStackParamList,
  Screens.CHANGE_DEFAULT_ACTIVTY_TYPE
>;
export type ChangeDisplayPreferencesScreenProps = StackScreenProps<
  MainStackParamList,
  Screens.CHANGE_DISPLAY_PREFERENCES
>;
export type ConfigureHealthInformationScreenProps = StackScreenProps<
  MainStackParamList,
  Screens.CONFIGURE_HEALTH_INFORMATION
>;
export type ChangePasswordScreenProps = StackScreenProps<
  MainStackParamList,
  Screens.CHANGE_PASSWORD
>;
export type ChoosePictureScreenProps = StackScreenProps<
  MainStackParamList,
  Screens.CHOOSE_PROFILE_PICTURE
>;
export type ConfigureRecoveryEmailScreenProps = StackScreenProps<
  MainStackParamList,
  Screens.CONFIGURE_RECOVERY_EMAIL
>;
export type PaywallScreenProps = StackScreenProps<MainStackParamList, Screens.PAYWALL>;
