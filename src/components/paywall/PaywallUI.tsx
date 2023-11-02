import React, { type FC, useMemo, useState } from 'react';
import { Linking, Pressable } from 'react-native';

import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';
import styled from 'styled-components/native';

import { ActivityIndicator, PrimaryButton, Text } from '@components/ui';

import i18n from '@translations/i18n';

import Features from './Features';
import PackageItem from './PackageItem';
import PurchasingModal from './PurchasingModal';

const Wrapper = styled.SafeAreaView`
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: stretch;

  background-color: ${({ theme }) => theme.colors.background};
`;

const LoadingWrapper = styled.View`
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.background};
`;

const PurchaseWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: stretch;
`;

const PurchaseButton = styled(PrimaryButton)`
  margin-top: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding / 2}px;
  margin-left: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-right: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const CancelText = styled(Text)`
  color: ${({ theme }) => theme.colors.secondary};
  margin-left: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const LinksWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 100%;

  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const LinkText = styled.Text`
  color: ${({ theme }) => theme.colors.purple};
`;

const LinkAnd = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
`;

type Props = {
  packages: PurchasesPackage[] | null;
  isPurchasing: boolean;
  purchasePackage: (packageItem: PurchasesPackage) => Promise<void>;
};

const PaywallUI: FC<Props> = ({ packages, isPurchasing, purchasePackage }) => {
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);

  const purchaseLabel = useMemo(() => {
    if (!selectedPackage) {
      return i18n.t('paywall.buttons.purchase');
    }

    return selectedPackage.packageType === PACKAGE_TYPE.MONTHLY
      ? i18n.t('paywall.buttons.purchaseMonthly')
      : i18n.t('paywall.buttons.purchaseYearly');
  }, [selectedPackage]);

  const openTermsOfUse = (): void => {
    Linking.openURL('https://withpace.io/terms-of-use');
  };

  const openPrivacyPolicy = (): void => {
    Linking.openURL('https://withpace.io/privacy-policy');
  };

  if (!packages) {
    return (
      <LoadingWrapper>
        <ActivityIndicator size="large" />
      </LoadingWrapper>
    );
  }

  return (
    <>
      <Wrapper>
        <Features />
        <PurchaseWrapper>
          {packages?.map((packageItem) => (
            <PackageItem
              key={packageItem.identifier}
              packageItem={packageItem}
              isSelected={packageItem.identifier === selectedPackage?.identifier}
              onSelect={() => setSelectedPackage(packageItem)}
            />
          ))}
          <PurchaseButton
            label={purchaseLabel}
            disabled={selectedPackage === null}
            onPress={() => purchasePackage(selectedPackage as PurchasesPackage)}
          />
          <CancelText>{i18n.t('paywall.cancel')}</CancelText>
          <LinksWrapper>
            <Pressable onPress={openTermsOfUse}>
              <LinkText>{i18n.t('onboarding.policies.termsOfUse')}</LinkText>
            </Pressable>
            <LinkAnd>{i18n.t('onboarding.policies.and')}</LinkAnd>
            <Pressable onPress={openPrivacyPolicy}>
              <LinkText>{i18n.t('onboarding.policies.privacyPolicy')}</LinkText>
            </Pressable>
          </LinksWrapper>
        </PurchaseWrapper>
      </Wrapper>
      <PurchasingModal isPurchasing={isPurchasing} packageItem={selectedPackage} />
    </>
  );
};

export default PaywallUI;
