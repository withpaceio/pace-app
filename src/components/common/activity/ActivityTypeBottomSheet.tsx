import React, { forwardRef } from 'react';

import type GorohmBottomSheet from '@gorhom/bottom-sheet';

import { useTheme } from '@theme';

import ActivityIcon from '@components/common/activity/ActivityIcon';
import { BottomSheet, BottomSheetLabel, BottomSheetMenuEntry } from '@components/ui';

import { ActivityType } from '@models/Activity';

import i18n from '@translations/i18n';

const SNAP_POINTS = ['20%'];
const ICON_SIZE = 25;

type Props = {
  onChangeActivityType: (type: ActivityType) => void;
};

const ActivityTypeBottomSheet = forwardRef<GorohmBottomSheet, Props>(
  ({ onChangeActivityType }, ref) => {
    const theme = useTheme();

    return (
      <BottomSheet ref={ref} index={-1} snapPoints={SNAP_POINTS} enablePanDownToClose>
        <BottomSheetMenuEntry
          onPress={() => {
            onChangeActivityType(ActivityType.RUNNING);
          }}>
          <ActivityIcon
            activityType={ActivityType.RUNNING}
            width={ICON_SIZE}
            height={ICON_SIZE}
            color={theme.colors.primary}
          />
          <BottomSheetLabel>{i18n.t('activityType.running')}</BottomSheetLabel>
        </BottomSheetMenuEntry>
        <BottomSheetMenuEntry
          onPress={() => {
            onChangeActivityType(ActivityType.CYCLING);
          }}>
          <ActivityIcon
            activityType={ActivityType.CYCLING}
            width={ICON_SIZE}
            height={ICON_SIZE}
            color={theme.colors.primary}
          />
          <BottomSheetLabel>{i18n.t('activityType.cycling')}</BottomSheetLabel>
        </BottomSheetMenuEntry>
      </BottomSheet>
    );
  },
);

ActivityTypeBottomSheet.displayName = 'ActivityTypeBottomSheet';

export default ActivityTypeBottomSheet;
