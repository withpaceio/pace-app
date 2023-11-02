import React, { type FC } from 'react';

import {
  BackdropBlur,
  Circle,
  Fill,
  Group,
  RoundedRect,
  Shadow,
  Text,
  rect,
  rrect,
  useFont,
} from '@shopify/react-native-skia';

import { useTheme } from '@theme';

import i18n from '@translations/i18n';

import useCursorValues from './hooks/useCursorValues';
import type { ChartCursorProps } from './types';

const robotoBoldFont = require('../../../../../../../assets/fonts/roboto/Roboto-Bold.ttf');
const robotoRegularFont = require('../../../../../../../assets/fonts/roboto/Roboto-Regular.ttf');

export const TOUCHABLE_AREA_WIDTH = 80;
const FONT_SIZE = 15;

const ChartCursor: FC<ChartCursorProps> = ({
  x,
  isActive,
  activityType,
  chartWidth,
  timeScale,
  distanceScale,
  paceHistogram,
  paceScale,
  elevationHistogram,
  elevationScale,
  distanceMeasurementSystem,
}) => {
  const fontBold = useFont(robotoBoldFont, FONT_SIZE);
  const fontRegular = useFont(robotoRegularFont, FONT_SIZE);

  const theme = useTheme();
  const {
    sizes: {
      paceChart: {
        cursor: { width: curorWidth, height: cursorHeight },
      },
    },
  } = theme;

  const {
    formattedDuration,
    formattedDistance,
    formattedPace,
    formattedElevation,
    transformElevation,
    transformLabel,
    transformSpeed,
    opacity,
    blur,
  } = useCursorValues({
    x,
    isActive,
    activityType,
    chartWidth,
    timeScale,
    distanceScale,
    paceHistogram,
    paceScale,
    elevationHistogram,
    elevationScale,
    distanceMeasurementSystem,
  });

  return (
    <>
      <Group transform={transformSpeed}>
        <Circle cx={0} cy={0} r={6} color={theme.colors.white}>
          <Shadow dx={0} dy={0} blur={6} color={theme.colors.white} />
        </Circle>
        <Circle cx={0} cy={0} r={4} color={theme.colors.purple} />
      </Group>
      <Group transform={transformLabel} opacity={opacity}>
        <BackdropBlur blur={blur} clip={rrect(rect(0, 0, curorWidth, cursorHeight), 10, 10)}>
          <Fill color={theme.colors.lightPurple} opacity={0.2} />
          <Text
            x={35}
            y={20}
            text={i18n.t('activityDetails.paceChart.cursor.distance')}
            font={fontRegular}
            color={theme.colors.primary}
          />
          <Text
            x={75}
            y={20}
            text={formattedDistance}
            font={fontBold}
            color={theme.colors.primary}
          />
          <Text
            x={35}
            y={40}
            text={i18n.t('activityDetails.paceChart.cursor.time')}
            font={fontRegular}
            color={theme.colors.primary}
          />
          <Text
            x={75}
            y={40}
            text={formattedDuration}
            font={fontBold}
            color={theme.colors.primary}
          />
          <RoundedRect
            rect={rrect(rect(12, 47, 15, 15), 5, 5)}
            color={theme.colors.activityDetails.paceChart.elevation.stroke}
            style="fill"
            opacity={1}>
            <Shadow dx={0} dy={0} blur={2} color={theme.colors.white} />
          </RoundedRect>
          <Text
            x={35}
            y={60}
            text={i18n.t('activityDetails.paceChart.cursor.elevation')}
            font={fontRegular}
            color={theme.colors.primary}
          />
          <Text
            x={75}
            y={60}
            text={formattedElevation}
            font={fontBold}
            color={theme.colors.primary}
          />
          <RoundedRect
            rect={rrect(rect(12, 68, 15, 15), 5, 5)}
            color={theme.colors.purple}
            style="fill"
            opacity={1}>
            <Shadow dx={0} dy={0} blur={2} color={theme.colors.white} />
          </RoundedRect>
          <Text
            x={35}
            y={80}
            text={i18n.t('activityDetails.paceChart.cursor.pace')}
            font={fontRegular}
            color={theme.colors.primary}
          />
          <Text x={75} y={80} text={formattedPace} font={fontBold} color={theme.colors.primary} />
        </BackdropBlur>
      </Group>
      <Group transform={transformElevation}>
        <Circle cx={0} cy={0} r={6} color={theme.colors.white}>
          <Shadow dx={0} dy={0} blur={6} color={theme.colors.white} />
        </Circle>
        <Circle
          cx={0}
          cy={0}
          r={4}
          color={theme.colors.activityDetails.paceChart.elevation.stroke}
        />
      </Group>
    </>
  );
};

export default ChartCursor;
