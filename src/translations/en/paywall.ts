export default {
  screenTitle: 'Manage your subscription',
  features: {
    title: 'Unlimited plan',
    unlimitedActivities: 'Unlimited number of activities',
    recordAndAnalyse: 'Record and analyse your activities',
    endToEndEncryption: 'End-to-end encryption',
    protectsPrivacy: 'Protects your privacy',
    cancel: 'Cancel anytime',
  },
  notFeatures: {
    title: 'We sell a private fitness tracker.',
    notFitnessData: 'Not your fitness data',
    notGeolocationData: 'Not your geolocation data',
    notAds: 'Not ads',
    notPrivacy: 'Not your privacy',
  },
  cancel: 'Recurring billing. Cancel anytime',
  buttons: {
    purchase: 'Purchase',
    purchaseMonthly: 'Purchase monthly plan',
    purchaseYearly: 'Purchase yearly plan',
  },
  purchasingModal: {
    monthly: 'Subscribing to the monthly plan…',
    yearly: 'Subscribing to the yearly plan…',
  },
  packageLoadingFailureModal: {
    errorMessage: 'A problem occurred. Try again later…',
    close: 'Close',
  },
  purchasingSuccessModal: {
    thankYou: 'Thank you for your subscription!',
    goToSettings: 'Go to settings',
  },
  purchasingFailureModal: {
    title: 'Subscription failed',
    pendingTitle: 'Pending purchase',
    errorMessages: {
      invalidAppUserId: 'App User Id is invalid.',
      invalidCredentials: 'Invalid credentials.',
      invalidSubscriberAttributes: 'Invalid subscriber attributes.',
      networkError:
        'A network error occurred during the operation. Please, make sure your device has an internet connection and try again.',
      operationAlreadyInProgress:
        'A purchase is already in progress. Please wait for the operation to complete.',
      storeProblem:
        'A problem occurred while trying to connect to the {{provider}}. Please try again later.',
      invalidReceiptError: 'Invalid receipt. Please try again later.',
      missingReceiptFile:
        'No receipt available on your device. Please, make sure you are signed into the device with a valid Apple account.',
      ineligibleError: 'The subscription offer is not available in your region.',
      alreadyInUse: 'There already exists an active subscription. Try restoring your purchases.',
      insuficientPermissions:
        'This device or your account does not have sufficient permissions to make a purchase. Please, make sure you are signed into in the device with a valid account that has permissions to make purchases.',
      purchaseInvalid: 'Invalid purchase. Please, make sure the device payment method is valid.',
      purchaseNotAllowed: 'The device or user is not allowed to make the purchase.',
      paymentPending: 'To complete your purchase, follow instructions given from {{provider}}.',
      unknown: 'A problem occurred while purchasing the subscription.',
    },
    close: 'Close',
  },
};
