import { ACTIVITY_TITLE_MAX_LENGTH, ACTIVITY_TITLE_MIN_LENGTH } from '../../consts';

export default {
  screenTitle: 'Save activity',
  mapNotAvailable: 'Map not available',
  saving: 'Saving your activity',
  form: {
    namePlaceholder: 'Activity name',
    nameTooShort: `Activity name must contain at least ${ACTIVITY_TITLE_MIN_LENGTH} characters`,
    nameTooLong: `Activity name must contain at most ${ACTIVITY_TITLE_MAX_LENGTH} characters`,
    nameMissing: 'Activity name is required',
    saveButtonLabel: 'Save',
    errorSaving: 'Failed to save the activity',
    defaultName: {
      morning: 'Morning {{activityType}}',
      afternoon: 'Afternoon {{activityType}}',
      evening: 'Evening {{activityType}}',
    },
    activityType: {
      running: 'run',
      cycling: 'ride',
    },
    activityTypeMissing: 'Activity type is required',
  },
  errors: {
    failureMessage: 'An error occurred while saving your activity.',
    retry: 'Retry',
    cancel: 'Discard my activity',
  },
  discardModal: {
    title: 'Discard your activity?',
    body: 'By discarding, you will lose your activity. Are you sure to discard?',
    buttons: {
      stayHere: 'Stay here',
      discard: 'Discard my activity',
    },
  },
};
