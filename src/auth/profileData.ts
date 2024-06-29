import { Platform } from 'react-native';

import { HKDF } from '@stablelib/hkdf';
import { SHA256 } from '@stablelib/sha256';
import * as utf8 from '@stablelib/utf8';
import {
  SECRETBOX_KEY_LENGTH,
  argon2idDeriveKey,
  decodeBase64,
  decodeUtf8,
  encodeBase64,
  secretboxOpen,
  secretboxSeal,
} from 'react-native-nacl-jsi';

import { ARGON2ID_ITERATIONS } from '@crypto';

import type { ProfileData, SerializedProfileData } from './types';

export function serializeProfileData(profileData: ProfileData): SerializedProfileData {
  return {
    passwordHashSalt: encodeBase64(profileData.passwordHashSalt),
    authHashedPasswordSalt: encodeBase64(profileData.authHashedPasswordSalt),
    profileEncryptionSalt: encodeBase64(profileData.profileEncryptionSalt),
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
  };
}

export function deserializeProfileData(serializedProfileData: SerializedProfileData): ProfileData {
  return {
    passwordHashSalt: decodeBase64(serializedProfileData.passwordHashSalt),
    authHashedPasswordSalt: decodeBase64(serializedProfileData.authHashedPasswordSalt),
    profileEncryptionSalt: decodeBase64(serializedProfileData.profileEncryptionSalt),
    keyPairs: {
      encryptionKeyPair: {
        publicKey: decodeBase64(serializedProfileData.keyPairs.encryptionKeyPair.publicKey),
        secretKey: decodeBase64(serializedProfileData.keyPairs.encryptionKeyPair.secretKey),
      },
      signingKeyPair: {
        publicKey: decodeBase64(serializedProfileData.keyPairs.signingKeyPair.publicKey),
        secretKey: decodeBase64(serializedProfileData.keyPairs.signingKeyPair.secretKey),
      },
    },
  };
}

export async function encryptProfileData(
  profileData: ProfileData,
  password: string,
): Promise<string> {
  const hashedPasswordBuffer = await argon2idDeriveKey(
    decodeUtf8(password),
    profileData.passwordHashSalt,
    32,
    ARGON2ID_ITERATIONS,
    Platform.OS === 'web' ? BigInt(32768) : BigInt(32768 * 1024),
  );

  const profileEncryptionKey = new HKDF(
    SHA256,
    hashedPasswordBuffer,
    profileData.profileEncryptionSalt,
  ).expand(Number(SECRETBOX_KEY_LENGTH));

  const serializedProfileData = serializeProfileData(profileData);

  const encryptedProfileData = secretboxSeal(
    decodeUtf8(encodeURI(JSON.stringify(serializedProfileData))),
    profileEncryptionKey,
  );

  return encodeBase64(encryptedProfileData);
}

export async function decryptProfileData(
  encryptedProfileData: string,
  password: string,
  passwordHashSalt: string,
  profileEncryptionSalt: string,
): Promise<ProfileData> {
  const hashedPasswordBuffer = await argon2idDeriveKey(
    decodeUtf8(password),
    decodeBase64(passwordHashSalt),
    32,
    ARGON2ID_ITERATIONS,
    Platform.OS === 'web' ? BigInt(32768) : BigInt(32768 * 1024),
  );

  const profileEncryptionKey = new HKDF(
    SHA256,
    hashedPasswordBuffer,
    decodeBase64(profileEncryptionSalt),
  ).expand(Number(SECRETBOX_KEY_LENGTH));

  const decryptedProfileDataBuffer = secretboxOpen(
    decodeBase64(encryptedProfileData),
    profileEncryptionKey,
  );

  const serializedProfileData: SerializedProfileData = JSON.parse(
    decodeURI(utf8.decode(decryptedProfileDataBuffer)),
  );

  return deserializeProfileData(serializedProfileData);
}
