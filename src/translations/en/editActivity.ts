import { ACTIVITY_TITLE_MAX_LENGTH, ACTIVITY_TITLE_MIN_LENGTH } from '../../consts';

export default {
  screenTitle: 'Edit activity',
  form: {
    nameTooShort: `Activity name must contain at least ${ACTIVITY_TITLE_MIN_LENGTH} characters`,
    nameTooLong: `Activity name must contain at most ${ACTIVITY_TITLE_MAX_LENGTH} characters`,
    nameMissing: 'Activity name is required',
    activityTypeMissing: 'Activity type is required',
  },
  savingModal: {
    title: 'Saving your activity',
    errorBody: 'An error occurred while saving your activity.',
    buttons: {
      retry: 'Retry',
      cancel: 'Cancel',
    },
  },
};
