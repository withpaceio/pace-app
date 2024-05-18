import React, { type FC, useCallback, useMemo } from 'react';

import { useRouter } from 'expo-router';

import { format } from 'date-fns';
import styled from 'styled-components/native';

import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import i18n from '@translations/i18n';

import AccountHeader from './AccountHeader';
import TrainingLogSummary from './TrainingLogSummary';

const Wrapper = styled.View`
  flex: 1;
`;

const ScrollWrapper = styled.ScrollView`
  flex: 1;

  border-top-left-radius: 15px;
  border-top-right-radius: 15px;

  background-color: transparent;
`;

const ContentWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  background-color: transparent;
  padding-top: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-horizontal: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = {
  startWeekDate: Date;
  endWeekDate: Date;
  startMonthDate: Date;
  endMonthDate: Date;
  distanceMeasurementSystem: DistanceMeasurementSystem;
};

const AccountUI: FC<Props> = ({
  startWeekDate,
  endWeekDate,
  startMonthDate,
  endMonthDate,
  distanceMeasurementSystem,
}) => {
  const router = useRouter();

  const weekSubTitle = useMemo(
    () => `${format(startWeekDate, 'MMMM do')} - ${format(endWeekDate, 'MMMM do')}`,
    [startWeekDate, endWeekDate],
  );

  const monthSubTitle = useMemo(() => format(startMonthDate, 'MMMM yyyy'), [startMonthDate]);

  const goToWeeklySummary = useCallback((): void => {
    router.push('/summary/weekly');
  }, [router]);

  const goToMonthlySummary = useCallback((): void => {
    router.push('/summary/monthly');
  }, [router]);

  return (
    <Wrapper>
      <AccountHeader />
      <ScrollWrapper>
        <ContentWrapper>
          <TrainingLogSummary
            title={i18n.t('account.weekSummary.title')}
            subTitle={weekSubTitle}
            startDate={startWeekDate}
            endDate={endWeekDate}
            distanceMeasurementSystem={distanceMeasurementSystem}
            onPress={goToWeeklySummary}
          />
          <TrainingLogSummary
            title={i18n.t('account.monthSummary.title')}
            subTitle={monthSubTitle}
            startDate={startMonthDate}
            endDate={endMonthDate}
            distanceMeasurementSystem={distanceMeasurementSystem}
            onPress={goToMonthlySummary}
          />
        </ContentWrapper>
      </ScrollWrapper>
    </Wrapper>
  );
};

export default AccountUI;
