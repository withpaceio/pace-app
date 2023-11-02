export default {
  screenTitle: 'Settings',
  version: 'Version {{version}}',
  saving: 'Saving…',
  signingOut: 'Signing out…',
  chooseProfilePicture: {
    screenTitle: 'Profile picture',
    edit: 'Edit',
    bottomSheet: {
      camera: 'Take photo',
      photo: 'Choose photo',
      delete: 'Delete photo',
    },
    updateSavingModal: {
      title: 'Saving your profile picture…',
      error: 'An error occurred while saving your profile picture.',
      buttons: {
        retry: 'Retry',
        discard: 'Discard',
      },
    },
    deleteSavingModal: {
      title: 'Deleting your profile picture…',
      error: 'An error occurred while deleting your profile picture.',
      buttons: {
        retry: 'Retry',
        discard: 'Discard',
      },
    },
    alert: {
      cameraPermissions: {
        title: '“PACE" cannot access the camera.',
        body: 'The camera permissions can be configured in Settings',
      },
      photoPermissions: {
        title: '“PACE" cannot access the photos.',
        body: 'The photos permissions can be configured in Settings.',
      },
      buttons: {
        openSettings: 'Open settings',
        cancel: 'Cancel',
      },
    },
    discardModal: {
      title: 'Discard the changes on your profile picture?',
      buttons: {
        stayHere: 'Stay here',
        discard: 'Discard the changes',
      },
    },
    errors: {
      openCameraFailure: 'Could not open the camera.',
      openPhotosFailure: 'Could not open the photos.',
    },
  },
  changeDefaultActivityType: {
    screenTitle: 'Default activity type',
    inputs: {
      activityType: {
        invalid: 'Invalid activity type',
        error: 'Activity type is required',
      },
    },
  },
  changeDisplayPreferences: {
    screenTitle: 'Display preferences',
    inputs: {
      systemOfMeasurement: {
        label: 'System of measurement',
        invalid: 'Invalid system of measurement',
        error: 'System of measurement is required',
      },
    },
    units: {
      label: 'Units',
      metric: 'Metric',
      imperial: 'Imperial',
    },
    discardModal: {
      title: 'Discard the changes on the display preferences?',
      buttons: {
        stayHere: 'Stay here',
        discard: 'Discard the changes',
      },
    },
    savingModal: {
      title: 'Saving your display preferences…',
      error: 'An error occurred while saving your display preferences.',
      buttons: {
        retry: 'Retry',
        discard: 'Discard',
      },
    },
  },
  configureHealthInformation: {
    screenTitle: 'Health information',
    notConfigured: 'Not configured',
    yearsOld: 'years old',
    saving: 'Saving your health information…',
    ok: 'OK',
    inputs: {
      gender: {
        label: 'Gender',
        male: 'Male',
        female: 'Female',
        'non-binary': 'Non-Binary',
        error: 'Gender is required',
        invalid: 'Gender is invalid',
      },
      birthDate: {
        label: 'Birth date',
        error: 'Birth date is required',
      },
      weight: {
        label: 'Weight ({{unit}})',
        placeholder: 'Weight ({{unit}})',
        error: 'Weight is required',
        invalid: 'Weight must be a number superior than 0',
      },
    },
    errors: {
      failureMessage: 'An error occurred while saving your health information.',
      retry: 'Retry',
      discard: 'Discard',
    },
  },
  defaultActivityType: {
    screenTitle: 'Default activity type',
    activityTypes: {
      running: 'Running',
      cycling: 'Cycling',
    },
    savingModal: {
      title: 'Saving your default activity type…',
      error: 'An error occurred while saving your default activity type.',
      buttons: {
        retry: 'Retry',
        discard: 'Discard',
      },
    },
  },
  manageSubscription: {
    freeTrial: 'Free plan',
    monthlySubscription: 'Monthly subscription',
    yearlySubscription: 'Yearly subscription',
  },
  changePassword: {
    screenTitle: 'Change password',
    label: 'Password',
    inputs: {
      oldPassword: {
        placeholder: 'Old password',
        error: 'Old password is required',
      },
      newPassword: {
        placeholder: 'New password',
        error: 'New password is required',
      },
      confirmNewPassword: {
        placeholder: 'Confirm new password',
        notMatching: 'Passwords do not match',
        error: 'You must confirm the new password',
      },
      passwordStrength: {
        error: 'Password is too weak.',
      },
    },
    savingModal: {
      title: 'Saving your password…',
      failedAuthError: 'Failed to authenticate. Your old password is incorrect.',
      error: 'An error occurred while saving your password.',
      buttons: {
        retry: 'Retry',
        discard: 'Discard',
      },
    },
  },
  recoveryEmail: {
    screenTitle: 'Configure email',
    label: 'Recovery email',
    configuredLabel: 'Configured at',
    notConfigured: 'Not configured',
    verified: 'Verified',
    notVerified: 'Not verified',
    inputPlaceholder: 'Recovery email address',
  },
  resendVerificationEmailStatus: {
    sending: 'Sending the verification email.',
    success: 'Verification email sent!',
    failure: 'Failed to send the verification email.',
  },
  restorePurchases: {
    failure: 'Failed to restore purchases.',
  },
  deleteAccount: {
    requiredActionModal: {
      title: 'Action required',
      explanation:
        'You must cancel your subscription on the {{store}} before deleting your account.',
      buttons: {
        close: 'Close',
      },
    },
    confirmModal: {
      title: 'Are you sure you want to delete your account?',
      explanation: 'All your data and activities will be permanently deleted.',
      buttons: {
        confirm: 'Yes, delete my account',
        cancel: 'Cancel',
      },
    },
    deletingModal: {
      title: 'Deleting your account…',
      hasError: {
        title: 'An error occurred while deleting your account.',
        explanation: 'Try again later or contact support at hello@withpace.io',
        buttons: {
          close: 'Close',
        },
      },
    },
  },
  buttons: {
    displayPreferences: 'Display preferences',
    healthInformation: 'Health information',
    defaultActivityType: 'Default activity type',
    manageSubscription: 'Manage subscription',
    restorePurchases: 'Restore purchases',
    deleteAccount: 'Delete account',
    configureRecoveryEmail: 'Configure',
    saveRecoveryEmail: 'Save',
    resendVerification: 'Resend the verification email',
    changePassword: 'Change password',
    signOut: 'Sign out',
  },
  errors: {
    failureMessage: 'An error occurred…',
    retry: 'Please, retry to save your email.',
  },
};
