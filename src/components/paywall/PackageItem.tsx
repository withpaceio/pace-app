import React, { type FC } from 'react';

import Checkbox from 'expo-checkbox';
import { PACKAGE_TYPE, type PurchasesPackage } from 'react-native-purchases';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { Text } from '@components/ui';

const Wrapper = styled.Pressable<{ isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  border-width: ${({ isSelected }) => (isSelected ? 2 : 1)}px;
  border-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.purple : theme.colors.separatorColor};
  border-radius: 10px;

  padding: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
  margin-left: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-right: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const DetailsWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  margin-left: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const Description = styled(Text)`
  font-family: 'Roboto-Bold';
  font-size: 16px;
`;

const PriceWrapper = styled.View`
  display: flex;
  flex-direction: row;
`;

type Props = {
  packageItem: PurchasesPackage;
  isSelected: boolean;
  onSelect: () => void;
};

const PackageItem: FC<Props> = ({ packageItem, isSelected, onSelect }) => {
  const theme = useTheme();

  return (
    <Wrapper isSelected={isSelected} onPress={onSelect}>
      <Checkbox
        value={isSelected}
        color={isSelected ? theme.colors.purple : theme.colors.separatorColor}
        onValueChange={onSelect}
      />
      <DetailsWrapper>
        <Description>
          {packageItem.packageType === PACKAGE_TYPE.MONTHLY ? 'Monthly plan' : 'Yearly plan'}
        </Description>
        <PriceWrapper>
          <Text>{packageItem.product.currencyCode} </Text>
          <Text>{packageItem.product.price.toFixed(2)}</Text>
          <Text> / {packageItem.packageType === PACKAGE_TYPE.MONTHLY ? 'month' : 'year'}</Text>
        </PriceWrapper>
      </DetailsWrapper>
    </Wrapper>
  );
};

export default PackageItem;
