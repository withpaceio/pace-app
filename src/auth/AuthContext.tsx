import React, {
  type FC,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import jwtDecode, { type JwtPayload } from 'jwt-decode';
import Purchases from 'react-native-purchases';

import queryClient from '../queryClient';
import refreshAccessToken from './refreshAccessToken';
import signOut from './signout';
import { type Profile, loadProfile as storageLoadProfile } from './storage';
import type { ProfileData } from './types';

type AuthState = {
  loading: boolean;
  userId: string;
  username: string;
  createdAt: Date | null;
  profileData: ProfileData | null;
};

type SignInAction = {
  type: 'AUTH_SIGN_IN';
  payload: Profile & { accessToken: string };
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
  getProfileData: () => ProfileData | null;
  getTokens: () => Promise<{ accessToken: string; refreshToken: string }>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  signOut: () => Promise<void>;
  isRefreshingTokens: () => boolean;
}>({
  state: {
    loading: true,
    userId: '',
    username: '',
    createdAt: null,
    profileData: null,
  },
  dispatch: () => undefined,
  getProfileData: () => null,
  getTokens: () => Promise.resolve({ accessToken: '', refreshToken: '' }),
  setTokens: () => undefined,
  signOut: () => Promise.resolve(),
  isRefreshingTokens: () => false,
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
        createdAt: null,
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
  const { isInternetReachable } = useNetInfo();

  const accessTokenRef = useRef<string>();
  const refreshTokenRef = useRef<string>();
  const isRefreshingTokensRef = useRef(false);

  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    userId: '',
    username: '',
    createdAt: null,
    profileData: null,
  });

  const onSignOut = useCallback(async () => {
    await signOut();
    queryClient.clear();
    AsyncStorage.clear();

    accessTokenRef.current = '';
    refreshTokenRef.current = '';
    isRefreshingTokensRef.current = false;

    dispatch({ type: 'AUTH_SIGN_OUT' });
  }, []);

  const loadProfile = useCallback(async (): Promise<void> => {
    const profile = await storageLoadProfile();
    if (!profile) {
      onSignOut();
      return;
    }

    await Purchases.logIn(profile.userId);
    accessTokenRef.current = '';
    refreshTokenRef.current = profile.refreshToken;

    dispatch({
      type: 'AUTH_RESTORE_PROFILE',
      payload: { profile },
    });
  }, [onSignOut]);

  const getProfileData = useCallback(
    (): ProfileData | null => state.profileData,
    [state.profileData],
  );

  const getTokens = useCallback(async (): Promise<{
    accessToken: string;
    refreshToken: string;
  }> => {
    if (isRefreshingTokensRef.current) {
      throw new Error('Refreshing');
    }

    if (accessTokenRef.current) {
      try {
        const decodedAccessToken = jwtDecode<JwtPayload>(accessTokenRef.current);
        if (decodedAccessToken?.exp && decodedAccessToken.exp >= Date.now() / 1000) {
          return { accessToken: accessTokenRef.current, refreshToken: refreshTokenRef.current! };
        }
        // eslint-disable-next-line no-empty
      } catch {}
    }

    isRefreshingTokensRef.current = true;

    const tokens = await refreshAccessToken(refreshTokenRef.current || '');
    if (!tokens) {
      if (isInternetReachable) {
        await onSignOut();
      }
      return { accessToken: '', refreshToken: '' };
    }

    accessTokenRef.current = tokens.accessToken;
    refreshTokenRef.current = tokens.refreshToken;
    isRefreshingTokensRef.current = false;

    return tokens;
  }, [isInternetReachable, onSignOut]);

  const isRefreshingTokens = useCallback((): boolean => isRefreshingTokensRef.current, []);

  const setTokens = useCallback((accessToken: string, refreshToken: string) => {
    accessTokenRef.current = accessToken;
    refreshTokenRef.current = refreshToken;
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        getProfileData,
        getTokens,
        setTokens,
        signOut: onSignOut,
        isRefreshingTokens,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): {
  state: AuthState;
  dispatch: (action: AuthAction) => void;
  getProfileData: () => ProfileData | null;
  getTokens: () => Promise<{ accessToken: string; refreshToken: string }>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  signOut: () => Promise<void>;
  isRefreshingTokens: () => boolean;
} => useContext(AuthContext);
