import React, { type FC, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import Purchases, {
  PURCHASES_ERROR_CODE,
  type PurchasesError,
  type PurchasesPackage,
} from 'react-native-purchases';

import { CancelHeaderButton } from '@components/common/header-buttons';
import PackageLoadingFailureModal from '@components/paywall/PackageLoadingFailureModal';
import PaywallUI from '@components/paywall/PaywallUI';
import PurchasingModalFailure from '@components/paywall/PurchasingFailureModal';
import PurchasingSuccessModal from '@components/paywall/PurchasingSuccessModal';

import Screens from '@navigation/screens';
import type { HomeScreenProps } from '@navigation/types';
import i18n from '@translations/i18n';

import {
  REVENUE_CAT_ENTITLEMENT_MONTHLY_ID,
  REVENUE_CAT_ENTITLEMENT_YEARLY_ID,
} from '../../consts';

const PaywallScreen: FC = () => {
  const [packages, setPackages] = useState<PurchasesPackage[] | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPackageLoadingFailureModalVisible, setIsPackageLoadingFailureModalVisible] =
    useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isFailureModalVisible, setIsFailureModalVisible] = useState(false);
  const [
    {
      purchasesErrorTitle,
      purchasesErrorMessage,
      purchasesTechnicalErrorMessage,
      purchasesUnderlyingErrorMessage,
    },
    setPurchasingModalContent,
  ] = useState<{
    purchasesErrorTitle: string | null;
    purchasesErrorMessage: string | null;
    purchasesTechnicalErrorMessage: string | null;
    purchasesUnderlyingErrorMessage: string | null;
  }>({
    purchasesErrorTitle: null,
    purchasesErrorMessage: null,
    purchasesTechnicalErrorMessage: null,
    purchasesUnderlyingErrorMessage: null,
  });

  const navigation = useNavigation<HomeScreenProps['navigation']>();

  const loadPackages = useCallback(async (): Promise<void> => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length > 0) {
        setPackages(offerings.current.availablePackages);
      }
    } catch {
      setIsPackageLoadingFailureModalVisible(true);
    }
  }, []);

  const purchasePackage = async (packageItem: PurchasesPackage): Promise<void> => {
    setIsPurchasing(true);

    try {
      const { customerInfo } = await Purchases.purchasePackage(packageItem);
      if (
        customerInfo.entitlements.active[REVENUE_CAT_ENTITLEMENT_MONTHLY_ID] !== undefined ||
        customerInfo.entitlements.active[REVENUE_CAT_ENTITLEMENT_YEARLY_ID] !== undefined
      ) {
        setIsPurchasing(false);
        setIsSuccessModalVisible(true);
      }
    } catch (error) {
      setIsPurchasing(false);

      const purchasesError = error as PurchasesError;
      if (purchasesError.userCancelled) {
        return;
      }

      switch (purchasesError.code) {
        case PURCHASES_ERROR_CODE.INVALID_APP_USER_ID_ERROR:
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: i18n.t(
              'paywall.purchasingFailureModal.errorMessages.invalidAppUserId',
            ),
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
        case PURCHASES_ERROR_CODE.INVALID_CREDENTIALS_ERROR:
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: i18n.t(
              'paywall.purchasingFailureModal.errorMessages.invalidCredentials',
            ),
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
        case PURCHASES_ERROR_CODE.INVALID_SUBSCRIBER_ATTRIBUTES_ERROR:
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: i18n.t(
              'paywall.purchasingFailureModal.errorMessages.invalidSubscriberAttributes',
            ),
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
        case PURCHASES_ERROR_CODE.NETWORK_ERROR:
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: i18n.t(
              'paywall.purchasingFailureModal.errorMessages.networkError',
            ),
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
        case PURCHASES_ERROR_CODE.OPERATION_ALREADY_IN_PROGRESS_ERROR:
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: i18n.t(
              'paywall.purchasingFailureModal.errorMessages.operationAlreadyInProgress',
            ),
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
        case PURCHASES_ERROR_CODE.STORE_PROBLEM_ERROR:
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: i18n.t(
              'paywall.purchasingFailureModal.errorMessages.storeProblem',
              { provider: Platform.OS === 'android' ? 'Play Store' : 'App Store' },
            ),
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
        case PURCHASES_ERROR_CODE.INVALID_RECEIPT_ERROR:
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: i18n.t(
              'paywall.purchasingFailureModal.errorMessages.invalidReceiptError',
            ),
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
        case PURCHASES_ERROR_CODE.MISSING_RECEIPT_FILE_ERROR:
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: i18n.t(
              'paywall.purchasingFailureModal.errorMessages.missingReceiptFile',
            ),
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
        case PURCHASES_ERROR_CODE.INELIGIBLE_ERROR:
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: i18n.t(
              'paywall.purchasingFailureModal.errorMessages.ineligibleError',
            ),
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
        case PURCHASES_ERROR_CODE.RECEIPT_ALREADY_IN_USE_ERROR:
        case PURCHASES_ERROR_CODE.PRODUCT_ALREADY_PURCHASED_ERROR:
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: i18n.t(
              'paywall.purchasingFailureModal.errorMessages.alreadyInUse',
            ),
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
        case PURCHASES_ERROR_CODE.PURCHASE_INVALID_ERROR:
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: i18n.t(
              'paywall.purchasingFailureModal.errorMessages.purchaseInvalid',
            ),
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
        case PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR:
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: i18n.t(
              'paywall.purchasingFailureModal.errorMessages.purchaseNotAllowed',
            ),
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
        case PURCHASES_ERROR_CODE.INSUFFICIENT_PERMISSIONS_ERROR:
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: i18n.t(
              'paywall.purchasingFailureModal.errorMessages.insufficientPermissions',
            ),
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
        case PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR:
          setPurchasingModalContent({
            purchasesErrorTitle: i18n.t('paywall.purchasingFailureModal.pendingTitle'),
            purchasesErrorMessage: i18n.t(
              'paywall.purchasingFailureModal.errorMessages.paymentPending',
              { provider: Platform.OS === 'android' ? 'Google' : 'Apple' },
            ),
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
        default:
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: null,
            purchasesTechnicalErrorMessage: purchasesError.message,
            purchasesUnderlyingErrorMessage: purchasesError.underlyingErrorMessage,
          });
          break;
      }

      setIsFailureModalVisible(true);
    }
  };

  const goToSettings = useCallback((): void => {
    setIsPackageLoadingFailureModalVisible(false);
    setIsSuccessModalVisible(false);

    const routes = navigation.getState().routes;
    const previousRoutes = routes[routes.length - 2].state?.routes;
    if (!previousRoutes || previousRoutes[previousRoutes.length - 1].name !== Screens.SETTINGS) {
      navigation.navigate(Screens.ACCOUNT);
      return;
    }

    navigation.navigate(Screens.SETTINGS);
  }, [navigation]);

  useEffect(() => {
    navigation.addListener('focus', loadPackages);

    return () => {
      navigation.removeListener('focus', loadPackages);
    };
  }, [loadPackages, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelHeaderButton disabled={isPurchasing} onPress={goToSettings} />,
    });
  }, [goToSettings, isPurchasing, navigation]);

  return (
    <>
      <PaywallUI
        packages={packages}
        isPurchasing={isPurchasing}
        purchasePackage={purchasePackage}
      />
      <PackageLoadingFailureModal
        visible={isPackageLoadingFailureModalVisible}
        onClose={goToSettings}
      />
      <PurchasingSuccessModal visible={isSuccessModalVisible} goToSettings={goToSettings} />
      <PurchasingModalFailure
        visible={isFailureModalVisible}
        title={purchasesErrorTitle}
        purchasesErrorMessage={purchasesErrorMessage}
        purchasesTechnicalErrorMessage={purchasesTechnicalErrorMessage}
        purchasesUnderlyingErrorMessage={purchasesUnderlyingErrorMessage}
        onClose={() => {
          setPurchasingModalContent({
            purchasesErrorTitle: null,
            purchasesErrorMessage: null,
            purchasesTechnicalErrorMessage: null,
            purchasesUnderlyingErrorMessage: null,
          });
          setIsFailureModalVisible(false);
        }}
      />
    </>
  );
};

export default PaywallScreen;
