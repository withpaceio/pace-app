import * as base64 from '@stablelib/base64';
import { HKDF } from '@stablelib/hkdf';
import { SHA256 } from '@stablelib/sha256';
import { SECRETBOX_KEY_LENGTH, argon2idDeriveKey, secretboxSeal } from 'react-native-nacl-jsi';

import { ARGON2ID_ITERATIONS } from '@crypto';

import type { ProfileData } from './types';

export default async function encryptProfileData(
  profileData: ProfileData,
  password: string,
): Promise<string> {
  const hashedPassword = argon2idDeriveKey(
    password,
    profileData.passwordHashSalt,
    32,
    ARGON2ID_ITERATIONS,
    32768 * 1024,
  );
  const hashedPasswordBuffer = base64.decode(hashedPassword);

  const profileEncryptionKey = new HKDF(
    SHA256,
    hashedPasswordBuffer,
    base64.decode(profileData.profileEncryptionSalt),
  ).expand(SECRETBOX_KEY_LENGTH);

  const encryptedProfileData = secretboxSeal(
    JSON.stringify(profileData),
    base64.encode(profileEncryptionKey),
  );

  return encryptedProfileData;
}
