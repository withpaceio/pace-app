import { HKDF } from '@stablelib/hkdf';
import { SHA256 } from '@stablelib/sha256';
import {
  SECRETBOX_KEY_LENGTH,
  argon2idDeriveKey,
  decodeUtf8,
  encodeBase64,
  secretboxSeal,
} from 'react-native-nacl-jsi';

import { ARGON2ID_ITERATIONS } from '@crypto';

import type { ProfileData } from './types';

export default async function encryptProfileData(
  profileData: ProfileData,
  password: string,
): Promise<string> {
  const hashedPasswordBuffer = argon2idDeriveKey(
    decodeUtf8(password),
    profileData.passwordHashSalt,
    32,
    ARGON2ID_ITERATIONS,
    BigInt(32768 * 1024),
  );

  const profileEncryptionKey = new HKDF(
    SHA256,
    hashedPasswordBuffer,
    profileData.profileEncryptionSalt,
  ).expand(Number(SECRETBOX_KEY_LENGTH));

  const encryptedProfileData = secretboxSeal(
    decodeUtf8(encodeURI(JSON.stringify(profileData))),
    profileEncryptionKey,
  );

  return encodeBase64(encryptedProfileData);
}
