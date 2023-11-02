import React, { FC, useMemo } from 'react';

import type { ScaleTime } from 'd3-scale';
import { format, isEqual } from 'date-fns';
import { Circle, Text } from 'react-native-svg';

import { useTheme } from '../../../theme';

type Props = {
  today: Date;
  date: Date;
  selectedDate: Date | null;
  timeScale: ScaleTime<number, number, never>;
  showDates: boolean;
};

const Label: FC<Props> = ({ today, date, selectedDate, timeScale, showDates }) => {
  const theme = useTheme();

  const { isToday, isSelected, xPosition, fill, dayFontSize, numberFontSize } = useMemo(() => {
    const x = timeScale(date) + 3;
    const _isToday = isEqual(date, today);

    if (!selectedDate) {
      return {
        isToday: _isToday,
        isSelected: false,
        xPosition: x,
        fill: theme.colors.primary,
        dayFontSize: theme.sizes.distanceBarChart.label.nonSelected.dayFontSize,
        numberFontSize: theme.sizes.distanceBarChart.label.nonSelected.dayFontSize,
      };
    }

    const selectedDateIsCurrent = isEqual(date, selectedDate);
    if (selectedDateIsCurrent) {
      return {
        isToday: _isToday,
        isSelected: selectedDateIsCurrent,
        xPosition: x,
        fill: theme.colors.purple,
        dayFontSize: theme.sizes.distanceBarChart.label.selected.dayFontSize,
        numberFontSize: theme.sizes.distanceBarChart.label.selected.dayFontSize,
      };
    }

    return {
      isToday: _isToday,
      isSelected: selectedDateIsCurrent,
      xPosition: x,
      fill: theme.colors.primary,
      dayFontSize: theme.sizes.distanceBarChart.label.nonSelected.dayFontSize,
      numberFontSize: theme.sizes.distanceBarChart.label.nonSelected.dayFontSize,
    };
  }, [theme, today, date, selectedDate, timeScale]);

  return (
    <>
      {isToday && <Circle x={xPosition} y={3} r={3} fill={theme.colors.green} opacity={1} />}
      {(showDates || isSelected) && (
        <>
          <Text
            x={xPosition}
            y={21}
            fontFamily="Roboto-Regular"
            fontSize={dayFontSize}
            fill={fill}
            textAnchor="middle">
            {format(date, 'EEEEE')}
          </Text>
          <Text
            x={xPosition}
            y={36}
            fontFamily="Roboto-Bold"
            fontSize={numberFontSize}
            fill={fill}
            textAnchor="middle">
            {format(date, 'd')}
          </Text>
        </>
      )}
    </>
  );
};

export default Label;
