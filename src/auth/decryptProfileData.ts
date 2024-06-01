import { HKDF } from '@stablelib/hkdf';
import { SHA256 } from '@stablelib/sha256';
import {
  SECRETBOX_KEY_LENGTH,
  argon2idDeriveKey,
  decodeBase64,
  decodeUtf8,
  encodeUtf8,
  secretboxOpen,
} from 'react-native-nacl-jsi';

import { ARGON2ID_ITERATIONS } from '@crypto';

import type { ProfileData } from './types';

export default async function decryptProfileData(
  encryptedProfileData: string,
  password: string,
  passwordHashSalt: string,
  profileEncryptionSalt: string,
): Promise<ProfileData> {
  const hashedPasswordBuffer = argon2idDeriveKey(
    decodeUtf8(password),
    decodeBase64(passwordHashSalt),
    32,
    ARGON2ID_ITERATIONS,
    BigInt(32768 * 1024),
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

  return JSON.parse(decodeURI(encodeUtf8(decryptedProfileDataBuffer)));
}
