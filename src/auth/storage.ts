import * as SecureStore from 'expo-secure-store';

import { deserializeProfileData, serializeProfileData } from './profileData';
import type { Profile, ProfileData } from './types';

const USERID_LOCATION = 'USERID';
const USERNAME_LOCATION = 'USERNAME';
const CREATED_AT_LOCATION = 'CREATED_AT';
const AUTH_TOKEN_LOCATION = 'AUTH_TOKEN';
const PROFILE_DATA_LOCATION = 'PROFILE_DATA';

export async function saveProfile(profile: Profile): Promise<boolean> {
  const profileData = profile.profileData as ProfileData;
  const serializedProfileData = serializeProfileData(profileData);

  try {
    await SecureStore.setItemAsync(USERID_LOCATION, profile.userId);
    await SecureStore.setItemAsync(USERNAME_LOCATION, profile.username);
    await SecureStore.setItemAsync(CREATED_AT_LOCATION, profile.createdAt.toISOString());
    await SecureStore.setItemAsync(AUTH_TOKEN_LOCATION, profile.authToken);
    await SecureStore.setItemAsync(PROFILE_DATA_LOCATION, JSON.stringify(serializedProfileData));

    return true;
  } catch {
    return false;
  }
}

export async function loadProfile(): Promise<Profile | null> {
  try {
    const userId = await SecureStore.getItemAsync(USERID_LOCATION);
    const username = await SecureStore.getItemAsync(USERNAME_LOCATION);
    const createdAt = await SecureStore.getItemAsync(CREATED_AT_LOCATION);
    const authToken = await SecureStore.getItemAsync(AUTH_TOKEN_LOCATION);
    const serializedProfileData = await SecureStore.getItemAsync(PROFILE_DATA_LOCATION);

    if (!userId || !username || !authToken || !serializedProfileData) {
      return null;
    }

    const profileData = JSON.parse(serializedProfileData);

    return {
      userId,
      username,
      createdAt: new Date(createdAt as string),
      authToken,
      profileData: deserializeProfileData(profileData),
    };
  } catch {
    return null;
  }
}

export async function deleteProfile(): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(USERID_LOCATION);
    await SecureStore.deleteItemAsync(USERNAME_LOCATION);
    await SecureStore.deleteItemAsync(CREATED_AT_LOCATION);
    await SecureStore.deleteItemAsync(AUTH_TOKEN_LOCATION);
    await SecureStore.deleteItemAsync(PROFILE_DATA_LOCATION);

    return true;
  } catch {
    return false;
  }
}
