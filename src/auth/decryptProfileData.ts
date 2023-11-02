import * as base64 from '@stablelib/base64';
import { HKDF } from '@stablelib/hkdf';
import { SHA256 } from '@stablelib/sha256';
import { SECRETBOX_KEY_LENGTH, argon2idDeriveKey, secretboxOpen } from 'react-native-nacl-jsi';

import { ARGON2ID_ITERATIONS } from '@crypto';

import type { ProfileData } from './types';

export default async function decryptProfileData(
  encryptedProfileData: string,
  password: string,
  passwordHashSalt: string,
  profileEncryptionSalt: string,
): Promise<ProfileData> {
  const hashedPassword = argon2idDeriveKey(
    password,
    passwordHashSalt,
    32,
    ARGON2ID_ITERATIONS,
    32768 * 1024,
  );

  const hashedPasswordBuffer = base64.decode(hashedPassword);
  const profileEncryptionSaltBuffer = base64.decode(profileEncryptionSalt);

  const profileEncryptionKey = new HKDF(
    SHA256,
    hashedPasswordBuffer,
    profileEncryptionSaltBuffer,
  ).expand(SECRETBOX_KEY_LENGTH);

  const decryptedProfileData = secretboxOpen(
    encryptedProfileData,
    base64.encode(profileEncryptionKey),
  );

  return JSON.parse(decodeURI(decryptedProfileData.replace(/\0/g, '')));
}
