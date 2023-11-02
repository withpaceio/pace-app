import React, { type FC, useCallback, useState } from 'react';
import { FlatList, type ListRenderItem, type ViewToken, useWindowDimensions } from 'react-native';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import GradientView from '@components/common/GradientView';
import { CheckIcon, CloseIcon } from '@components/icons';
import { Text } from '@components/ui';

import i18n from '@translations/i18n';

const Wrapper = styled.View`
  flex: 1;

  max-height: 350px;
`;

const FeaturesWrapper = styled(GradientView)<{ windowWidth: number; index: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;

  width: ${({ theme, windowWidth }) => windowWidth - 2 * theme.sizes.outerPadding}px;

  margin-left: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-right: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-top: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding / 2}px;
  padding: ${({ theme }) => theme.sizes.outerPadding}px;

  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.separatorColor};
  border-radius: 10px;
`;

const FeatureWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const FeatureTitle = styled(Text)`
  font-family: 'Roboto-Bold';
  font-size: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
`;

const FeatureText = styled(Text)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.white};
  margin-left: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const DotsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Dot = styled.View<{ isSelected: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  margin: ${({ theme }) => theme.sizes.innerPadding / 2}px;

  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.purple : theme.colors.secondary};
`;

type Feature = {
  title: string;
  features: string[];
  included: boolean;
};

const Features: FC = () => {
  const [selectedDot, setSelectedDot] = useState(0);
  const { width: windowWidth } = useWindowDimensions();
  const theme = useTheme();

  const getItemLayout = useCallback(
    (_: ArrayLike<Feature> | null | undefined, index: number) => ({
      length: windowWidth,
      offset: windowWidth * index,
      index,
    }),
    [windowWidth],
  );

  const renderFeatures: ListRenderItem<Feature> = useCallback(
    ({ item: { title, features, included }, index }) => (
      <FeaturesWrapper
        colors={[theme.colors.black, theme.colors.blackPurple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        windowWidth={windowWidth}
        index={index}>
        <FeatureTitle>{title}</FeatureTitle>
        {features.map((feature) => (
          <FeatureWrapper key={feature}>
            {included ? (
              <CheckIcon width={27} height={27} color={theme.colors.green} strokeWidth={2.5} />
            ) : (
              <CloseIcon width={27} height={27} color={theme.colors.red} strokeWidth={2.5} />
            )}
            <FeatureText>{feature}</FeatureText>
          </FeatureWrapper>
        ))}
      </FeaturesWrapper>
    ),
    [
      theme.colors.black,
      theme.colors.blackPurple,
      theme.colors.green,
      theme.colors.red,
      windowWidth,
    ],
  );

  const onViewableItemsChanged = useCallback(({ changed }: { changed: ViewToken[] }): void => {
    setSelectedDot(changed[0].isViewable ? (changed[0].index as number) : 0);
  }, []);

  return (
    <Wrapper>
      <FlatList
        data={[
          {
            title: i18n.t('paywall.features.title'),
            features: [
              i18n.t('paywall.features.unlimitedActivities'),
              i18n.t('paywall.features.recordAndAnalyse'),
              i18n.t('paywall.features.endToEndEncryption'),
              i18n.t('paywall.features.protectsPrivacy'),
              i18n.t('paywall.features.cancel'),
            ],
            included: true,
          },
          {
            title: i18n.t('paywall.notFeatures.title'),
            features: [
              i18n.t('paywall.notFeatures.notFitnessData'),
              i18n.t('paywall.notFeatures.notGeolocationData'),
              i18n.t('paywall.notFeatures.notAds'),
              i18n.t('paywall.notFeatures.notPrivacy'),
            ],
            included: false,
          },
        ]}
        renderItem={renderFeatures}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
      />
      <DotsWrapper>
        <Dot isSelected={selectedDot === 0} />
        <Dot isSelected={selectedDot === 1} />
      </DotsWrapper>
    </Wrapper>
  );
};

export default Features;
