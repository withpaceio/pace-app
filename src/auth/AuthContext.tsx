import React, {
  type FC,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases from 'react-native-purchases';

import queryClient from '../queryClient';
import signOut from './signout';
import { type Profile, loadProfile as storageLoadProfile } from './storage';
import type { ProfileData } from './types';

type AuthState = Omit<Profile, 'authToken'> & {
  authToken: string | null;
  loading: boolean;
};

type SignInAction = {
  type: 'AUTH_SIGN_IN';
  payload: Profile;
};

type SignOutAction = {
  type: 'AUTH_SIGN_OUT';
};

type RestoreProfileAction = {
  type: 'AUTH_RESTORE_PROFILE';
  payload: {
    profile: Profile;
  };
};

export type AuthAction = SignInAction | SignOutAction | RestoreProfileAction;

// eslint-disable-next-line no-spaced-func
const AuthContext = createContext<{
  state: AuthState;
  dispatch: (action: AuthAction) => void;
  getAuthToken: () => string | null;
  getProfileData: () => ProfileData | null;
  signOut: () => Promise<void>;
}>({
  state: {
    loading: true,
    userId: '',
    username: '',
    authToken: null,
    createdAt: new Date(),
    profileData: null,
  },
  dispatch: () => undefined,
  getAuthToken: () => null,
  getProfileData: () => null,
  signOut: () => Promise.resolve(),
});

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_SIGN_IN':
      return {
        ...state,
        loading: false,
        userId: action.payload.userId,
        username: action.payload.username,
        createdAt: action.payload.createdAt,
        profileData: action.payload.profileData,
      };
    case 'AUTH_SIGN_OUT':
      return {
        loading: false,
        userId: '',
        username: '',
        authToken: '',
        createdAt: new Date(),
        profileData: null,
      };
    case 'AUTH_RESTORE_PROFILE':
      return {
        ...state,
        loading: false,
        userId: action.payload.profile.userId,
        username: action.payload.profile.username,
        createdAt: action.payload.profile.createdAt,
        profileData: action.payload.profile.profileData,
      };
    default:
      return state;
  }
}

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    userId: '',
    username: '',
    authToken: null,
    createdAt: new Date(),
    profileData: null,
  });

  const onSignOut = useCallback(async () => {
    await signOut();

    queryClient.clear();
    AsyncStorage.clear();

    dispatch({ type: 'AUTH_SIGN_OUT' });
  }, []);

  const loadProfile = useCallback(async (): Promise<void> => {
    const profile = await storageLoadProfile();
    if (!profile) {
      onSignOut();
      return;
    }

    await Purchases.logIn(profile.userId);

    dispatch({
      type: 'AUTH_RESTORE_PROFILE',
      payload: { profile },
    });
  }, [onSignOut]);

  const getAuthToken = useCallback((): string | null => state.authToken, [state.authToken]);

  const getProfileData = useCallback(
    (): ProfileData | null => state.profileData,
    [state.profileData],
  );

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        getAuthToken,
        getProfileData,
        signOut: onSignOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): {
  state: AuthState;
  dispatch: (action: AuthAction) => void;
  getAuthToken: () => string | null;
  getProfileData: () => ProfileData | null;
  signOut: () => Promise<void>;
} => useContext(AuthContext);
