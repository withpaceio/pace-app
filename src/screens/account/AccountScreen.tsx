import React, { type FC, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek, subMinutes } from 'date-fns';

import usePreferences from '@api/preferences/usePreferences';

import AccountUI from '@components/account/AccountUI';

import { DistanceMeasurementSystem } from '@models/UnitSystem';
import type { AccountScreenProps } from '@navigation/types';

const AccountScreen: FC<AccountScreenProps> = () => {
  const navigation = useNavigation();

  const { data: preferencesData } = usePreferences();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const today = useMemo(() => new Date(), [navigation.isFocused]);

  const { startWeekDate, endWeekDate } = useMemo(() => {
    const start = subMinutes(startOfWeek(today, { weekStartsOn: 1 }), today.getTimezoneOffset());
    const end = endOfWeek(start, { weekStartsOn: 1 });

    return { startWeekDate: start, endWeekDate: end };
  }, [today]);

  const { startMonthDate, endMonthDate } = useMemo(() => {
    const start = subMinutes(startOfMonth(today), today.getTimezoneOffset());
    const end = endOfMonth(start);

    return { startMonthDate: start, endMonthDate: end };
  }, [today]);

  return (
    <AccountUI
      startWeekDate={startWeekDate}
      endWeekDate={endWeekDate}
      startMonthDate={startMonthDate}
      endMonthDate={endMonthDate}
      distanceMeasurementSystem={preferencesData?.measurement || DistanceMeasurementSystem.METRIC}
    />
  );
};

export default AccountScreen;
