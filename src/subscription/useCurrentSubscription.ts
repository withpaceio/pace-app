import { useCallback, useEffect, useState } from 'react';

import Purchases, {
  type CustomerInfo,
  type PurchasesEntitlementInfo,
} from 'react-native-purchases';

import { REVENUE_CAT_ENTITLEMENT_MONTHLY_ID, REVENUE_CAT_ENTITLEMENT_YEARLY_ID } from '../consts';

type State = {
  currentSubscription: PurchasesEntitlementInfo | null;
  managementUrl: string | null;
  loading: boolean;
  error: boolean;
};

export default function useCurrentSubscription(): State {
  const [{ currentSubscription, managementUrl, loading, error }, setState] = useState<State>({
    currentSubscription: null,
    managementUrl: null,
    loading: true,
    error: false,
  });

  const onCustomerInfoUpdate = useCallback((customerInfo: CustomerInfo): void => {
    const activeEntitlement =
      customerInfo.entitlements.active[REVENUE_CAT_ENTITLEMENT_MONTHLY_ID] ||
      customerInfo.entitlements.active[REVENUE_CAT_ENTITLEMENT_YEARLY_ID];

    if (activeEntitlement !== undefined) {
      setState({
        currentSubscription: activeEntitlement,
        managementUrl: customerInfo.managementURL,
        loading: false,
        error: false,
      });
      return;
    }

    setState({ currentSubscription: null, managementUrl: null, loading: false, error: false });
  }, []);

  const loadSubscription = useCallback(async (): Promise<void> => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      onCustomerInfoUpdate(customerInfo);
    } catch {
      setState({ currentSubscription: null, managementUrl: null, loading: false, error: true });
    }
  }, [onCustomerInfoUpdate]);

  useEffect(() => {
    loadSubscription();
    Purchases.addCustomerInfoUpdateListener(onCustomerInfoUpdate);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(onCustomerInfoUpdate);
    };
  }, [loadSubscription, onCustomerInfoUpdate]);

  return { currentSubscription, managementUrl, loading, error };
}
