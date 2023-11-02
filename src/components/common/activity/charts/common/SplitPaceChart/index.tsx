import React, { type FC } from 'react';
import { useWindowDimensions } from 'react-native';

import { Canvas } from '@shopify/react-native-skia';
import { GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import styled from 'styled-components/native';

import type { Split as SplitType } from '@activity';

import { Text as TextUI } from '@components/ui';

import { ActivityType } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';
import i18n from '@translations/i18n';

import useSplitChartTouchHandler from './hooks/useSplitChartTouchHandler';
import Split from './Split';
import type { Scale } from '../PaceChart/hooks/useScaleLinear';

const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  padding-top: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-bottom: ${({ theme }) => 2 * theme.sizes.outerPadding}px;

  background-color: ${({ theme }) => theme.colors.background};
`;

const StyledCanvas = styled(Canvas)<{ numSplits: number }>`
  width: 100%;
  height: ${({ numSplits, theme }) =>
    numSplits * (theme.sizes.splitChart.barHeight + theme.sizes.splitChart.barMarginBottom)}px;

  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled(TextUI)`
  font-size: 18px;
  font-weight: bold;

  align-self: flex-start;

  margin-left: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const SplitHeaderWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: baseline;

  margin-left: ${({ theme }) => theme.sizes.innerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const SplitHeaderText = styled(TextUI)`
  width: ${({ theme }) => theme.sizes.splitChart.splitValueWidth}px;

  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const SplitHeaderSpeedText = styled(SplitHeaderText)`
  margin-left: -${({ theme }) => theme.sizes.innerPadding}px;
  margin-right: ${({ theme }) => theme.sizes.innerPadding}px;
`;

type Props = {
  activityType: ActivityType;
  title: string;
  paceLabel: string;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  paceScale: Scale;
  splits: SplitType[];
  splitLengthInMeters: number;
  currentHighlightedSplit: SharedValue<number>;
  previousHighlightedSplit: SharedValue<number>;
  splitPathsTransition: SharedValue<number>;
};

const SplitPaceChart: FC<Props> = ({
  activityType,
  title,
  paceLabel,
  distanceMeasurementSystem,
  paceScale,
  splits,
  splitLengthInMeters,
  currentHighlightedSplit,
  previousHighlightedSplit,
  splitPathsTransition,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  const gesture = useSplitChartTouchHandler({
    splits,
    currentHighlightedSplit,
    previousHighlightedSplit,
    splitPathsTransition,
  });

  return (
    <Wrapper>
      <Title>{title}</Title>
      <SplitHeaderWrapper>
        <SplitHeaderText>
          {distanceMeasurementSystem === DistanceMeasurementSystem.METRIC ? 'KM' : 'Mi'}
        </SplitHeaderText>
        {activityType === ActivityType.RUNNING && <SplitHeaderText>{paceLabel}</SplitHeaderText>}
        {activityType === ActivityType.CYCLING && (
          <SplitHeaderSpeedText>{paceLabel}</SplitHeaderSpeedText>
        )}
        <SplitHeaderText>{i18n.t('activityDetails.elevation')}</SplitHeaderText>
      </SplitHeaderWrapper>
      <GestureDetector gesture={gesture}>
        <StyledCanvas numSplits={splits.length}>
          {splits.map((split, index) => (
            <Split
              key={`${split.distance}-${split.pace}-${split.elevation}`}
              activityType={activityType}
              split={split}
              splitIndex={index}
              splitLengthInMeters={splitLengthInMeters}
              currentHighlightedSplit={currentHighlightedSplit}
              distanceMeasurementSystem={distanceMeasurementSystem}
              paceScale={paceScale}
              chartWidth={windowWidth}
            />
          ))}
        </StyledCanvas>
      </GestureDetector>
    </Wrapper>
  );
};

export default SplitPaceChart;
