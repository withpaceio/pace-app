import React, { FC, Fragment, useCallback, useEffect, useMemo } from 'react';
import { PanResponder, useWindowDimensions } from 'react-native';

import { scaleLinear, scaleTime } from 'd3-scale';
import {
  addDays,
  closestIndexTo,
  differenceInCalendarDays,
  isEqual,
  startOfDay,
  subMinutes,
} from 'date-fns';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import { useTheme } from '@theme';

import { Activity, ActivitySummary } from '@models/Activity';

import Label from './Label';

type Props = {
  activities: Activity[];
  startDate: Date;
  endDate: Date;
  today: Date;
  selectedDate: Date | null;
  onSelectedDate: (selectedDate: Date, selectedActivityIds: string[]) => void;
};

const DistanceBarChart: FC<Props> = ({
  activities,
  startDate,
  endDate,
  today,
  selectedDate,
  onSelectedDate,
}) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const data = useMemo(() => {
    const days = [];
    let d = startDate;
    while (d <= endDate) {
      days.push(d);
      d = addDays(d, 1);
    }

    const distances = days.map((day) => {
      const inRangeActivities = activities.filter(({ summary }) => {
        const activityDate = new Date((summary as ActivitySummary).createdAt);
        const referenceActivityDate = subMinutes(
          startOfDay(activityDate),
          activityDate.getTimezoneOffset(),
        );

        return differenceInCalendarDays(day, referenceActivityDate) === 0;
      });

      const inRangeDistance = inRangeActivities.reduce(
        (totalDistance, currentActivity) =>
          totalDistance + (currentActivity.summary as ActivitySummary).distance,
        0,
      );

      return { date: day, distance: inRangeDistance, activities: inRangeActivities };
    });

    return distances;
  }, [startDate, endDate, activities]);

  const { svgWidth, svgHeight } = useMemo(
    () => ({
      svgWidth: width - theme.sizes.outerPadding * 4,
      svgHeight: theme.sizes.distanceBarChart.height + 24,
    }),
    [theme, width],
  );

  const timeScale = useMemo(
    () =>
      scaleTime()
        .range([10, svgWidth - 18])
        .domain([data[0].date, data[data.length - 1].date]),
    [data, svgWidth],
  );

  const yScale = useMemo(() => {
    const maxDistance = Math.max(...data.map(({ distance }) => distance));
    const maxDomain = maxDistance > 0 ? maxDistance : 1;

    return scaleLinear()
      .range([0, theme.sizes.distanceBarChart.height - 20])
      .domain([0, Math.round(maxDomain + maxDomain / 10)]);
  }, [data, theme.sizes.distanceBarChart.height]);

  const selectDate = useCallback(
    (cursorPosition: number): void => {
      const cursorDate = startOfDay(new Date(timeScale.invert(cursorPosition - 38)));
      const referenceDate = subMinutes(cursorDate, cursorDate.getTimezoneOffset());

      const closestIndex = closestIndexTo(
        referenceDate,
        data.map(({ date }) => date),
      ) as number;
      const closestDate = data[closestIndex].date;
      const selectedActivityIds = data[closestIndex].activities.map(({ id }) => id);

      onSelectedDate(closestDate, selectedActivityIds);
    },
    [data, onSelectedDate, timeScale],
  );

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { moveX }) => selectDate(moveX),
  });

  useEffect(() => {
    if (selectedDate) {
      return;
    }

    selectDate(timeScale(today) + 38);
  }, [selectedDate, today, timeScale, selectDate]);

  return (
    <Svg width={svgWidth} height={svgHeight} {...panResponder.panHandlers}>
      <Defs>
        <LinearGradient id="barGradient" x1="0%" x2="0%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={theme.colors.green} />
          <Stop offset="100%" stopColor={theme.colors.purple} />
        </LinearGradient>
      </Defs>
      {data.map(({ date, distance }) => (
        <Fragment key={date.toISOString()}>
          <Label
            today={today}
            date={date}
            selectedDate={selectedDate}
            timeScale={timeScale}
            showDates={data.length === 7}
          />
          <Rect
            x={timeScale(date)}
            y={40}
            ry={5}
            width={theme.sizes.distanceBarChart.barWidth}
            height={theme.sizes.distanceBarChart.height - 15}
            fill={theme.colors.darkComponentBackground}
            opacity={isEqual(date, selectedDate as Date) ? 1 : 0.4}
          />
          <Rect
            x={timeScale(date)}
            y={theme.sizes.distanceBarChart.height - yScale(distance) + 24}
            ry={5}
            width={theme.sizes.distanceBarChart.barWidth}
            height={yScale(distance)}
            fill="url(#barGradient)"
            opacity={isEqual(date, selectedDate as Date) ? 1 : 0.6}
          />
        </Fragment>
      ))}
    </Svg>
  );
};

export default DistanceBarChart;
