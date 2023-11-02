import React, { type FC, useCallback } from 'react';

import { Route, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  TransitionSpecs,
  createStackNavigator,
} from '@react-navigation/stack';

import Header from '@components/navigation/Header';

import ActivityDetailsScreen from '@screens/activityDetails/ActivityDetailsScreen';
import ZoomableMapScreen from '@screens/activityDetails/ZoomableMapScreen';
import EditActivityScreen from '@screens/editActivity/EditActivityScreen';
import SaveScreen from '@screens/save/SaveScreen';
import SettingsScreen from '@screens/settings/SettingsScreen';
import MonthlySummaryScreen from '@screens/summary/MonthlySummaryScreen';
import WeeklySummaryScreen from '@screens/summary/WeeklySummaryScreen';
import i18n from '@translations/i18n';

import HomeTabsNavigator from './HomeTabsNavigator';
import Screens from './screens';
import { HomeStackParamList } from './types';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeNavigator: FC = () => {
  const showHeader = useCallback((route: Route<string, object | undefined>): boolean => {
    const routeName = getFocusedRouteNameFromRoute(route);
    return !routeName || routeName === Screens.HOME;
  }, []);

  return (
    <Stack.Navigator initialRouteName={Screens.HOME_TABS_NAVIGATOR}>
      <Stack.Screen
        name={Screens.HOME_TABS_NAVIGATOR}
        component={HomeTabsNavigator}
        options={({ route }) => ({
          title: i18n.t('home.screenTitle'),
          headerShown: showHeader(route),
          headerTitle: Header,
        })}
      />
      <Stack.Screen
        name={Screens.ACTIVITY_DETAILS}
        // @ts-ignore
        component={ActivityDetailsScreen}
        options={{
          title: i18n.t('activityDetails.screenTitle'),
          headerTitle: i18n.t('activityDetails.screenTitle'),
          headerShown: false,
          transitionSpec: {
            open: TransitionSpecs.FadeInFromBottomAndroidSpec,
            close: TransitionSpecs.FadeOutToBottomAndroidSpec,
          },
        }}
      />
      <Stack.Screen
        name={Screens.ACTIVITY_DETAILS_ZOOMABLE_MAP}
        // @ts-ignore
        component={ZoomableMapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Screens.EDIT_ACTIVITY}
        // @ts-ignore
        component={EditActivityScreen}
        options={{
          headerMode: 'screen',
          headerTitle: i18n.t('editActivity.screenTitle'),
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      />
      <Stack.Screen
        name={Screens.SAVE}
        // @ts-ignore
        component={SaveScreen}
        options={{
          headerTitle: i18n.t('saveActivity.screenTitle'),
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={Screens.SETTINGS}
        // @ts-ignore
        component={SettingsScreen}
        options={{
          title: i18n.t('settings.title'),
          headerTitle: i18n.t('settings.screenTitle'),
          headerBackTitle: i18n.t('account.screenTitle'),
        }}
      />
      <Stack.Screen
        name={Screens.WEEKLY_SUMMARY}
        component={WeeklySummaryScreen}
        options={{
          title: i18n.t('summary.weekly.screenTitle'),
          headerTitle: i18n.t('summary.weekly.screenTitle'),
          headerBackTitle: i18n.t('account.screenTitle'),
        }}
      />
      <Stack.Screen
        name={Screens.MONTHLY_SUMMARY}
        component={MonthlySummaryScreen}
        options={{
          title: i18n.t('summary.monthly.screenTitle'),
          headerTitle: i18n.t('summary.monthly.screenTitle'),
          headerBackTitle: i18n.t('account.screenTitle'),
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
