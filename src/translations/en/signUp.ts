export default {
  title: 'Create your account',
  loadingLabel: 'Signing up…',
  inputs: {
    username: {
      placeholder: 'Username',
      tooShort: 'Username must contain at least 3 characters.',
      error: 'Username is required.',
      checkingAvailability: 'Checking username availability…',
      available: 'Username is available.',
      unavailableError: 'Username is not available.',
    },
    password: {
      placeholder: 'Password',
      error: 'Password is required.',
    },
    passwordStrength: {
      error: 'Password is too weak.',
    },
    confirmPassword: {
      placeholder: 'Confirm password',
      error: 'You must confirm your password.',
      notMatching: 'Passwords do not match.',
    },
  },
  buttons: {
    signUp: 'Create account',
  },
  errors: {
    failed: 'Failed to sign up…',
  },
};
