import React, { type FC, useMemo } from 'react';
import { Animated, TouchableOpacity, useWindowDimensions } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { differenceInDays, format, formatRelative } from 'date-fns';
import { Control, Controller, type UseFormHandleSubmit } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { ChevronDownIcon, MoreVertical } from '@components/icons';
import { Text, TextInput } from '@components/ui';

import { type ActivityLocation, type ActivitySummary, ActivityType } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import i18n from '@translations/i18n';

import ActivityIcon from './ActivityIcon';
import ActivityStatistics from './statistics/ActivityStatistics';

const Wrapper = styled(LinearGradient)`
  z-index: 2;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.background};

  padding-top: ${({ theme }) => theme.sizes.outerPadding}px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const SafeAreaHeaderFiller = styled(Animated.View)<{ safeAreaTop: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ safeAreaTop }) => safeAreaTop + 15}px;

  background-color: ${({ theme }) => theme.colors.componentBackground};

  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const HeaderWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  padding-horizontal: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-bottom: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const TitleWrapper = styled.View<{ isEditing: boolean; windowWidth: number }>`
  width: ${({ isEditing, theme, windowWidth }) =>
    isEditing
      ? '100%'
      : `${windowWidth - 2 * theme.sizes.outerPadding - theme.sizes.innerPadding - 25}px`};

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const TitleIconWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const IconWrapper = styled.View`
  padding: ${({ theme }) => 0.8 * theme.sizes.innerPadding}px;
  background-color: ${({ theme }) => theme.colors.componentBackground};
  border-radius: 15px;
`;

const Title = styled(Text)`
  font-size: 20px;
  font-weight: bold;

  margin-bottom: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const EditActivityTypeWrapper = styled.Pressable`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  padding: ${({ theme }) => 0.5 * theme.sizes.innerPadding}px;
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;

  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.textInput.unfocused.border};
  border-radius: 3px;

  background-color: ${({ theme }) => theme.colors.componentBackground};
`;

const ActivityTypeIconWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const ActivityTypeText = styled(Text)`
  margin-left: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const CreatedAt = styled.Text<{ isEditing: boolean }>`
  font-style: italic;
  color: ${({ theme }) => theme.colors.secondary};

  margin-top: ${({ isEditing, theme }) => (isEditing ? theme.sizes.innerPadding : 0)}px;
  margin-left: ${({ theme }) => 0.5 * theme.sizes.innerPadding}px;
  margin-bottom: ${({ isEditing }) => (isEditing ? 200 : 0)}px;
`;

const Border = styled(Animated.View)`
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.separatorColor};
`;

type FormData = {
  name: string;
  type: ActivityType;
};

export type Props = {
  summary: (Omit<ActivitySummary, 'name' | 'updatedAt'> & { name?: string }) | null;
  locations: ActivityLocation[] | undefined;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  isLoading: boolean;
  inputsDisabled?: boolean;
  top?: Animated.Value;
  imageHeight: number;
  onEdit?: () => void;
  onEditActivityType?: () => void;
  form?: {
    control: Control<FormData, any>;
    handleSubmit: UseFormHandleSubmit<FormData>;
    onSubmit: (data: FormData) => void;
  };
};

const ActivityHeader: FC<Props> = ({
  summary,
  locations,
  distanceMeasurementSystem,
  isLoading,
  inputsDisabled,
  top,
  imageHeight,
  onEdit,
  onEditActivityType,
  form,
}) => {
  const theme = useTheme();

  const { width: windowWidth } = useWindowDimensions();
  const { top: safeAreaTop } = useSafeAreaInsets();

  const activityDate = useMemo(() => {
    if (!summary) {
      return '';
    }

    const now = Date.now();
    const createdAtDate = new Date((summary as ActivitySummary).createdAt);
    const relativetoNow = Math.abs(differenceInDays(createdAtDate, now));
    if (relativetoNow < 6) {
      return formatRelative(createdAtDate, now);
    }

    const formattedDate = format(createdAtDate, 'EEEE, LLLL dd, yyyy');
    const formattedHour = format(createdAtDate, 'h:mm a');
    return `${formattedDate}, ${i18n.t('activityDetails.atHour')} ${formattedHour}`;
  }, [summary]);

  const titleAnimatedStyle = useMemo(
    () => ({
      width: form ? ('100%' as `${number}%`) : undefined,
      transform: [
        {
          translateX:
            top?.interpolate({
              inputRange: [
                0,
                imageHeight - safeAreaTop - 35,
                imageHeight - safeAreaTop,
                imageHeight - safeAreaTop + 1,
              ],
              outputRange: [0, 0, 35, 35],
            }) || 0,
        },
      ],
    }),
    [form, imageHeight, safeAreaTop, top],
  );

  return (
    <>
      <Animated.View
        style={{
          zIndex: 2,
          transform: [
            {
              translateY:
                top?.interpolate({
                  inputRange: [-1, 0, 0, imageHeight - safeAreaTop, imageHeight],
                  outputRange: [0, 0, 0, 0, safeAreaTop],
                }) || 0,
            },
          ],
        }}>
        <SafeAreaHeaderFiller
          safeAreaTop={safeAreaTop}
          style={{
            transform: [
              {
                translateY:
                  top?.interpolate({
                    inputRange: [0, imageHeight - safeAreaTop, imageHeight, imageHeight + 1],
                    outputRange: [0, 0, -safeAreaTop - 2, -safeAreaTop - 2],
                  }) || 0,
              },
            ],
            opacity: top?.interpolate({
              inputRange: [0, imageHeight - safeAreaTop - 1, imageHeight - safeAreaTop],
              outputRange: [0, 0, 1],
            }),
          }}
        />
        <Wrapper colors={[theme.colors.componentBackground, theme.colors.background]}>
          <HeaderWrapper>
            <Animated.View style={titleAnimatedStyle}>
              <TitleWrapper isEditing={!!form} windowWidth={windowWidth}>
                {summary?.name && onEdit && <Title>{summary.name}</Title>}
                {form && (
                  <>
                    <Controller
                      control={form.control}
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <TextInput
                          placeholder={i18n.t('saveActivity.form.namePlaceholder')}
                          value={value}
                          caption={error?.message}
                          editable={inputsDisabled}
                          autoCapitalize="none"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          onSubmitEditing={form.handleSubmit(form.onSubmit)}
                        />
                      )}
                      name="name"
                      rules={{ required: true }}
                      defaultValue={summary?.name || ''}
                    />
                    <EditActivityTypeWrapper onPress={onEditActivityType}>
                      <ActivityTypeIconWrapper>
                        <IconWrapper>
                          <ActivityIcon
                            activityType={summary?.type || ActivityType.RUNNING}
                            width={20}
                            height={20}
                            color={theme.colors.primary}
                          />
                        </IconWrapper>
                        <ActivityTypeText>
                          {summary?.type
                            ? i18n.t(`activityType.${summary.type.toLocaleLowerCase()}`)
                            : ActivityType.RUNNING}
                        </ActivityTypeText>
                      </ActivityTypeIconWrapper>
                      <ChevronDownIcon width={27} height={27} color={theme.colors.primary} />
                    </EditActivityTypeWrapper>
                  </>
                )}
                <TitleIconWrapper>
                  {summary && !form && (
                    <IconWrapper>
                      <ActivityIcon
                        activityType={summary.type}
                        width={20}
                        height={20}
                        color={theme.colors.primary}
                      />
                    </IconWrapper>
                  )}
                  <CreatedAt isEditing={!!form}>{activityDate}</CreatedAt>
                </TitleIconWrapper>
              </TitleWrapper>
            </Animated.View>
            {onEdit && (
              <TouchableOpacity onPress={onEdit} disabled={isLoading}>
                <MoreVertical
                  color={isLoading ? theme.colors.secondary : theme.colors.primary}
                  width={25}
                  height={25}
                />
              </TouchableOpacity>
            )}
          </HeaderWrapper>
          <Border
            style={{
              opacity:
                top?.interpolate({
                  inputRange: [0, imageHeight - safeAreaTop, imageHeight, imageHeight + 1],
                  outputRange: [0, 0, 1, 1],
                }) || 0,
            }}
          />
        </Wrapper>
      </Animated.View>
      {summary && !form && (
        <ActivityStatistics
          summary={summary}
          locations={locations}
          distanceMeasurementSystem={distanceMeasurementSystem}
        />
      )}
    </>
  );
};

export default ActivityHeader;
