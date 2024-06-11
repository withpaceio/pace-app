import React, {
  type FC,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import Purchases from 'react-native-purchases';
import styled from 'styled-components/native';

import { PaceIcon } from '@components/icons';

import { storage } from '../queryClient/storagePersister';
import LoggedOutModal from './LoggedOutModal';
import signOut from './signout';
import { loadProfile as storageLoadProfile } from './storage';
import type { Profile, ProfileData } from './types';

const LoadingWrapper = styled.View`
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.black};
`;

type AuthState = Omit<Profile, 'authToken'> & {
  authToken: string | null;
  loading: boolean;
  isLoggedOutModalOpen: boolean;
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

type OpenLoggedOutModalAction = {
  type: 'AUTH_OPEN_LOGGED_OUT_MODAL';
};

type CloseLoggedOutModalAction = {
  type: 'AUTH_CLOSE_LOGGED_OUT_MODAL';
};

export type AuthAction =
  | SignInAction
  | SignOutAction
  | RestoreProfileAction
  | OpenLoggedOutModalAction
  | CloseLoggedOutModalAction;

// eslint-disable-next-line no-spaced-func
const AuthContext = createContext<{
  state: AuthState;
  dispatch: (action: AuthAction) => void;
  getAuthToken: () => string | null;
  getProfileData: () => ProfileData | null;
  signOut: () => Promise<void>;
  openLoggedOutModal: () => void;
  closeLoggedOutModal: () => void;
}>({
  state: {
    loading: true,
    userId: '',
    username: '',
    authToken: null,
    createdAt: new Date(),
    profileData: null,
    isLoggedOutModalOpen: false,
  },
  dispatch: () => undefined,
  getAuthToken: () => null,
  getProfileData: () => null,
  signOut: () => Promise.resolve(),
  openLoggedOutModal: () => undefined,
  closeLoggedOutModal: () => undefined,
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
        authToken: action.payload.authToken,
        profileData: action.payload.profileData,
      };
    case 'AUTH_SIGN_OUT':
      return {
        loading: false,
        userId: '',
        username: '',
        authToken: null,
        createdAt: new Date(),
        profileData: null,
        isLoggedOutModalOpen: false,
      };
    case 'AUTH_RESTORE_PROFILE':
      return {
        ...state,
        loading: false,
        userId: action.payload.profile.userId,
        username: action.payload.profile.username,
        createdAt: action.payload.profile.createdAt,
        authToken: action.payload.profile.authToken,
        profileData: action.payload.profile.profileData,
      };
    case 'AUTH_OPEN_LOGGED_OUT_MODAL':
      return {
        ...state,
        isLoggedOutModalOpen: true,
      };
    case 'AUTH_CLOSE_LOGGED_OUT_MODAL':
      return {
        ...state,
        isLoggedOutModalOpen: false,
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
    isLoggedOutModalOpen: false,
  });

  const onSignOut = useCallback(async () => {
    await signOut();
    storage.clearAll();

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

  const openLoggedOutModal = useCallback((): void => {
    dispatch({ type: 'AUTH_OPEN_LOGGED_OUT_MODAL' });
  }, []);

  const closeLoggedOutModal = useCallback((): void => {
    dispatch({ type: 'AUTH_CLOSE_LOGGED_OUT_MODAL' });
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (state.loading) {
    return (
      <LoadingWrapper>
        <PaceIcon width={110} height={75} />
      </LoadingWrapper>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        getAuthToken,
        getProfileData,
        signOut: onSignOut,
        openLoggedOutModal,
        closeLoggedOutModal,
      }}>
      {children}
      <LoggedOutModal
        isOpen={state.isLoggedOutModalOpen}
        signOut={onSignOut}
        close={closeLoggedOutModal}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = (): {
  state: AuthState;
  dispatch: (action: AuthAction) => void;
  getAuthToken: () => string | null;
  getProfileData: () => ProfileData | null;
  signOut: () => Promise<void>;
  openLoggedOutModal: () => void;
  closeLoggedOutModal: () => void;
} => useContext(AuthContext);
