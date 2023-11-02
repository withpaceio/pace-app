import { AuthAction, signIn as authSignIn, signUp as authSignUp } from '@auth';

export async function signIn(
  username: string,
  password: string,
  dispatch: (action: AuthAction) => void,
): Promise<string | null> {
  try {
    const { userId, createdAt, accessToken, refreshToken, profileData } = await authSignIn(
      username,
      password,
    );

    dispatch({
      type: 'AUTH_SIGN_IN',
      payload: {
        userId,
        username,
        createdAt,
        accessToken,
        refreshToken,
        profileData,
      },
    });

    return userId;
  } catch {
    return null;
  }
}

export async function signUp(
  username: string,
  password: string,
  dispatch: (action: AuthAction) => void,
): Promise<string | null> {
  try {
    await authSignUp(username, password);
    return signIn(username, password, dispatch);
  } catch {
    return null;
  }
}
