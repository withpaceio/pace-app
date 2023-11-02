const authKeys = {
  usernameAvailable: (username: string | undefined) => ['isUsernameAvailable', username],
  signIn: () => ['signIn'],
  signUp: () => ['signUp'],
  signOut: () => ['signOut'],
};

export default authKeys;
