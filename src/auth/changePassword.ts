import * as base64 from '@stablelib/base64';
import { HKDF } from '@stablelib/hkdf';
import { SHA256 } from '@stablelib/sha256';
import { argon2idDeriveKey, getRandomBytes } from 'react-native-nacl-jsi';

import {
  ARGON2ID_ITERATIONS,
  ARGON2ID_SALT_LENGTH,
  HKDF_PASSWORD_TOKEN_LENGTH,
  HKDF_SALT_LENGTH,
} from '@crypto';

import encryptProfileData from './encryptProfileData';
import * as SRP from './srp';
import type { ProfileData } from './types';

export default async function changePassword(
  username: string,
  newPassword: string,
  profileData: ProfileData,
): Promise<{
  passwordHashSalt: string;
  passwordTokenSalt: string;
  srpSalt: string;
  srpVerifier: string;
  profileEncryptionSalt: string;
  encryptedProfileData: string;
}> {
  const passwordHashSalt = getRandomBytes(ARGON2ID_SALT_LENGTH);
  const authHashedPasswordSalt = getRandomBytes(HKDF_SALT_LENGTH);
  const profileEncryptionSalt = getRandomBytes(HKDF_SALT_LENGTH);

  const newProfileData: ProfileData = {
    passwordHashSalt,
    authHashedPasswordSalt,
    profileEncryptionSalt,
    keyPairs: profileData.keyPairs,
  };

  const newEncryptedProfileData = await encryptProfileData(newProfileData, newPassword);

  const hashedPassword = argon2idDeriveKey(
    newPassword,
    newProfileData.passwordHashSalt,
    32,
    ARGON2ID_ITERATIONS,
    32768 * 1024,
  );

  const authPasswordTokenBuffer = new HKDF(
    SHA256,
    base64.decode(hashedPassword),
    base64.decode(newProfileData.authHashedPasswordSalt),
  ).expand(HKDF_PASSWORD_TOKEN_LENGTH);

  const srpParameters = SRP.getParameters();
  const srpSalt = await SRP.generateSalt(srpParameters);
  const srpPrivateKey = await SRP.derivePrivateKey(
    srpSalt,
    username,
    base64.encode(authPasswordTokenBuffer),
    srpParameters,
  );
  const srpVerifier = SRP.deriveVerifier(srpPrivateKey, srpParameters);

  return {
    passwordHashSalt: newProfileData.passwordHashSalt,
    passwordTokenSalt: newProfileData.authHashedPasswordSalt,
    srpSalt,
    srpVerifier,
    profileEncryptionSalt: newProfileData.profileEncryptionSalt,
    encryptedProfileData: newEncryptedProfileData,
  };
}
