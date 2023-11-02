import { getRandomBytes } from 'react-native-nacl-jsi';

import { ARGON2ID_SALT_LENGTH, HKDF_SALT_LENGTH, generateKeys } from '@crypto';

import type { ProfileData } from './types';

export default function generateProfile(): ProfileData {
  const passwordHashSalt = getRandomBytes(ARGON2ID_SALT_LENGTH);
  const authHashedPasswordSalt = getRandomBytes(HKDF_SALT_LENGTH);
  const profileEncryptionSalt = getRandomBytes(HKDF_SALT_LENGTH);
  const keyPairs = generateKeys();

  return {
    passwordHashSalt,
    authHashedPasswordSalt,
    profileEncryptionSalt,
    keyPairs,
  };
}
