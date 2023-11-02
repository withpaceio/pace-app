import * as SecureStore from 'expo-secure-store';

import type { ProfileData } from './types';

export type Profile = {
  userId: string;
  username: string;
  createdAt: Date;
  refreshToken: string;
  profileData: ProfileData | null;
};

const USERID_LOCATION = 'USERID';
const USERNAME_LOCATION = 'USERNAME';
const CREATEDAT_LOCATION = 'CREATED_AT';
const REFRESH_TOKEN_LOCATION = 'REFRESH_TOKEN';
const PROFILE_DATA_LOCATION = 'PROFILE_DATA';

export async function saveProfile(profile: Profile): Promise<boolean> {
  const serializedProfileData = JSON.stringify(profile.profileData as ProfileData);

  try {
    await SecureStore.setItemAsync(USERID_LOCATION, profile.userId);
    await SecureStore.setItemAsync(USERNAME_LOCATION, profile.username);
    await SecureStore.setItemAsync(CREATEDAT_LOCATION, profile.createdAt.toISOString());
    await SecureStore.setItemAsync(REFRESH_TOKEN_LOCATION, profile.refreshToken);
    await SecureStore.setItemAsync(PROFILE_DATA_LOCATION, serializedProfileData);

    return true;
  } catch {
    return false;
  }
}

export async function loadProfile(): Promise<Profile | null> {
  try {
    const userId = await SecureStore.getItemAsync(USERID_LOCATION);
    const username = await SecureStore.getItemAsync(USERNAME_LOCATION);
    const createdAt = await SecureStore.getItemAsync(CREATEDAT_LOCATION);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_LOCATION);
    const serializedProfileData = await SecureStore.getItemAsync(PROFILE_DATA_LOCATION);

    if (!userId || !username || !refreshToken || !serializedProfileData) {
      return null;
    }

    const profileData = JSON.parse(serializedProfileData);

    return {
      userId,
      username,
      createdAt: new Date(createdAt as string),
      refreshToken,
      profileData,
    };
  } catch {
    return null;
  }
}

export async function deleteProfile(): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(USERID_LOCATION);
    await SecureStore.deleteItemAsync(USERNAME_LOCATION);
    await SecureStore.deleteItemAsync(CREATEDAT_LOCATION);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_LOCATION);
    await SecureStore.deleteItemAsync(PROFILE_DATA_LOCATION);

    return true;
  } catch {
    return false;
  }
}

export async function saveRefreshToken(refreshToken: string): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_LOCATION, refreshToken);
    return true;
  } catch {
    return false;
  }
}
