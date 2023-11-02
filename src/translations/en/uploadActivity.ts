export default {
  pageTitle: 'Upload a run | PACE',
  title: 'Upload a run',
  loading: 'Uploading...',
  tabs: {
    manual: 'Manual entry',
    gpx: 'GPX file',
  },
  labels: {
    duration: 'Duration',
    selectFile: 'Select the GPX file:',
  },
  nameInput: {
    placeholder: 'Run name',
    errors: {
      missing: 'Name is required.',
    },
  },
  distanceInput: {
    placeholder: 'Distance in kilometers',
    errors: {
      invalid: 'Distance is invalid.',
      missing: 'Distance is required.',
    },
  },
  hoursInput: {
    placeholder: 'Hours',
    errors: {
      invalid: 'Hour is invalid.',
      missing: 'Hour is required.',
    },
  },
  minutesInput: {
    placeholder: 'Minutes',
    errors: {
      invalid: 'Minute is invalid.',
      missing: 'Minute is required.',
    },
  },
  secondsInput: {
    placeholder: 'Seconds',
    errors: {
      invalid: 'Second is invalid.',
      missing: 'Second is required.',
    },
  },
  filenameInput: {
    errors: {
      missing: 'GPX file to upload is missing.',
    },
  },
  buttons: {
    upload: 'Upload',
  },
  errors: {
    failed: 'Failed to upload the run...',
  },
};
