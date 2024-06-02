import * as SecureStore from 'expo-secure-store';

import { decodeBase64, encodeBase64 } from 'react-native-nacl-jsi';

import type { ProfileData } from './types';

export type Profile = {
  userId: string;
  username: string;
  createdAt: Date;
  authToken: string;
  profileData: ProfileData | null;
};

const USERID_LOCATION = 'USERID';
const USERNAME_LOCATION = 'USERNAME';
const CREATED_AT_LOCATION = 'CREATED_AT';
const AUTH_TOKEN_LOCATION = 'AUTH_TOKEN';
const PROFILE_DATA_LOCATION = 'PROFILE_DATA';

export async function saveProfile(profile: Profile): Promise<boolean> {
  const profileData = profile.profileData as ProfileData;

  const serializedProfileData = JSON.stringify({
    ...profileData,
    keyPairs: {
      encryptionKeyPair: {
        publicKey: encodeBase64(profileData.keyPairs.encryptionKeyPair.publicKey),
        secretKey: encodeBase64(profileData.keyPairs.encryptionKeyPair.secretKey),
      },
      signingKeyPair: {
        publicKey: encodeBase64(profileData.keyPairs.signingKeyPair.publicKey),
        secretKey: encodeBase64(profileData.keyPairs.signingKeyPair.secretKey),
      },
    },
  });

  try {
    await SecureStore.setItemAsync(USERID_LOCATION, profile.userId);
    await SecureStore.setItemAsync(USERNAME_LOCATION, profile.username);
    await SecureStore.setItemAsync(CREATED_AT_LOCATION, profile.createdAt.toISOString());
    await SecureStore.setItemAsync(AUTH_TOKEN_LOCATION, profile.authToken);
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
      profileData: {
        ...profileData,
        keyPairs: {
          encryptionKeyPair: {
            publicKey: decodeBase64(profileData.keyPairs.encryptionKeyPair.publicKey),
            secretKey: decodeBase64(profileData.keyPairs.encryptionKeyPair.secretKey),
          },
          signingKeyPair: {
            publicKey: decodeBase64(profileData.keyPairs.signingKeyPair.publicKey),
            secretKey: decodeBase64(profileData.keyPairs.signingKeyPair.secretKey),
          },
        },
      },
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
